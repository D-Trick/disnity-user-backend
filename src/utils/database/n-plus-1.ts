// lodash
import isEmpty from 'lodash/isEmpty';
import cloneDeep from 'lodash/cloneDeep';

/**************************************************/
export interface Config {
    primaryColumn: string;
    joinGroups: JoinGroup[];
}

interface JoinGroup {
    outputColumn: string;
    referenceColumn: string;
    selectColumns: SelectColumns[];
}

interface SelectColumns {
    originalName: string;
    changeName?: string;
}

interface DynamicObject {
    [key: string]: any;
}
/**************************************************/

export class Nplus1<T> {
    private queryResult: DynamicObject[];
    private primaryColumn: string;
    private joinGroups: JoinGroup[] = [];
    private deleteColumnList: string[] = [];
    private defaultOutputColumns: DynamicObject = {};

    /**************************************************
     * Constructor
     **************************************************/
    constructor(queryResult: DynamicObject[], config: Config) {
        this.queryResult = queryResult;
        this.primaryColumn = config.primaryColumn;
        this.joinGroups = config.joinGroups;

        this.validate();

        this.init();
    }

    /**************************************************
     * Public Methods
     **************************************************/
    getOne(): T | undefined {
        if (!this.queryResult || this.queryResult.length === 0) {
            return undefined;
        }

        const groupData = this.group();
        const { length } = groupData;
        if (length > 1) {
            throw new Error('그룹화된 데이터가 2개이상 입니다. 현재 그룹화 데이터 또는 쿼리결과 데이터를 확인하세요.');
        }

        const isEmpty = length === 0;
        const result = isEmpty ? undefined : groupData[0];

        return result;
    }
    getMany(): T[] {
        if (!this.queryResult || this.queryResult.length === 0) {
            return [];
        }

        const groupData = this.group();

        return groupData;
    }

    /**************************************************
     * Private Methods
     **************************************************/
    /**
     * options, 비교해야될 컬럼 유효성검사
     */
    private validate() {
        const columns = Object.keys(this.queryResult[0]);

        if (isEmpty(this.primaryColumn)) {
            throw new Error('config.primaryColumn Option이 없습니다.');
        }
        if (isEmpty(this.joinGroups)) {
            throw new Error('config.joinGroups Option이 없습니다.');
        }
        if (this.isColumnNotFound(columns, this.primaryColumn)) {
            throw new Error(`Column: ${this.primaryColumn}이(가) 없습니다.`);
        }

        this.joinGroups.map((joinGroup) => {
            if (this.isColumnNotFound(columns, joinGroup.referenceColumn)) {
                throw new Error(`Column: ${joinGroup.referenceColumn}이(가) 없습니다.`);
            }

            if (isEmpty(joinGroup.selectColumns)) {
                throw new Error('joinGroup.selectColumns Option이 없습니다.');
            }
            joinGroup.selectColumns.map((selectColumn) => {
                if (this.isColumnNotFound(columns, selectColumn.originalName)) {
                    throw new Error(`Column: ${selectColumn.originalName}이(가) 없습니다.`);
                }
            });
        });
    }

    /**
     * 초기화
     */
    private init() {
        const { length } = this.joinGroups;
        for (let i = 0; i < length; i++) {
            const { outputColumn, referenceColumn, selectColumns } = this.joinGroups[i];

            this.defaultOutputColumns[outputColumn] = [];

            const selectOriginalColumns = selectColumns.map((column) => column.originalName);
            this.deleteColumnList = this.deleteColumnList.concat(referenceColumn, selectOriginalColumns);
        }
    }

    /**
     * 컬럼이 존재하는지 검사
     * @param {string[]} columnsToCompare
     * @param {string} columnToCheck
     */
    private isColumnNotFound(columnsToCompare: string[], columnToCheck: string) {
        return !columnsToCompare.includes(columnToCheck);
    }

    /**
     * N + 1 해결을위해 Join을 사용해 만든 쿼리결과를 그룹화 작업을 한다.
     */
    private group(): T[] {
        const newQueryResult = [];

        let outputColumns = cloneDeep(this.defaultOutputColumns);

        const { length: queryResultLength } = this.queryResult;
        const lastIndex = queryResultLength - 1;
        const isDataOne = queryResultLength === 1;
        for (let currentIndex = 0; currentIndex < queryResultLength; currentIndex++) {
            const currentRow = this.queryResult[currentIndex];

            const greaterThanOrEqual = currentIndex >= lastIndex;
            const nextIndex = greaterThanOrEqual ? lastIndex : currentIndex + 1;
            const nextRow = this.queryResult[nextIndex];

            outputColumns = this.joinRowGrouping(currentRow, outputColumns);

            const isLastIndex = currentIndex === lastIndex;
            const isDifferentRow = currentRow[this.primaryColumn] !== nextRow[this.primaryColumn];
            if (isDataOne || isLastIndex || isDifferentRow) {
                const newCurrentRow = this.deleteUnusedColumns(currentRow);
                const uniqOutputColumns = this.removeDuplicateGroupData(outputColumns);
                newQueryResult.push({ ...newCurrentRow, ...uniqOutputColumns });

                outputColumns = cloneDeep(this.defaultOutputColumns);
            }
        }

        return newQueryResult;
    }

    /**
     * 현재 행에서 Join의 결과를 outputColumns 기준으로 데이터 그룹화 작업을 한다.
     * @param {DynamicObject} row
     * @param {DynamicObject} outputColumns
     */
    private joinRowGrouping(row: DynamicObject, outputColumns: DynamicObject) {
        const newOutputColumns = cloneDeep(outputColumns);

        const { length: joinGroupsLength } = this.joinGroups;
        for (let i = 0; i < joinGroupsLength; i++) {
            const { outputColumn, referenceColumn, selectColumns } = this.joinGroups[i];

            if (row[referenceColumn]) {
                const columns = this.changeSelectColumnNames(row, selectColumns);
                newOutputColumns[outputColumn].push(columns);
            }
        }

        return newOutputColumns;
    }

    /**
     * 현재 행에서 Join을 통해 가져온 Column의 이름을 변경한다.
     * @param {DynamicObject} row
     * @param {SelectColumns[]} selectColumns
     */
    private changeSelectColumnNames(row: DynamicObject, selectColumns: SelectColumns[]) {
        const changedColumns = {};

        const { length } = selectColumns;
        for (let i = 0; i < length; i++) {
            const column = selectColumns[i];
            const columnName = column.changeName || column.originalName;

            changedColumns[columnName] = row[column.originalName];
        }

        return changedColumns;
    }

    /**
     * 현재 행에서 사용하지 않는 column을 전부 삭제 한다.
     * 삭제되는 컬럼: Join할때 사용된 reference column, Join 후 Select의 진짜 컬럼이름
     * @param {DynamicObject} row
     */
    private deleteUnusedColumns(row: DynamicObject) {
        const currentRow = { ...row };

        for (const column in currentRow) {
            const isDeleteColumnFound = this.deleteColumnList.includes(column);
            if (isDeleteColumnFound) {
                delete currentRow[column];
            }
        }

        return currentRow;
    }

    /**
     * 표시될 그룹 컬럼명(outputColumns)으로 그룹화된 데이터들을 중복제거한다.
     * @param {DynamicObject} groupData
     */
    private removeDuplicateGroupData(groupData: DynamicObject) {
        const newGroupData = { ...groupData };

        for (const column in newGroupData) {
            const jsonArrayStringify = newGroupData[column].map((group) => {
                const jsonString = JSON.stringify(group);
                if (jsonString === '{}') {
                    throw new Error('undefined, function, symbol은 값으로 사용할 수 없습니다.');
                }

                return jsonString;
            });

            const setJsonArray = [...new Set(jsonArrayStringify)];

            newGroupData[column] = setJsonArray.map((json: any) => JSON.parse(json));
        }

        return newGroupData;
    }
}
