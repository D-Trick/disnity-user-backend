// lodash
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

export default class Nplus1<T> {
    private primaryColumn: string;
    private joinGroups: JoinGroup[] = [];
    private deleteColumnList: string[] = [];
    private defaultOutputGroups: DynamicObject = {};

    /**************************************************
     * Constructor
     **************************************************/
    constructor(
        private readonly queryResult: T[],
        private readonly config: Config,
    ) {
        if (!config) throw new Error('config not found');
        if (!config?.primaryColumn) throw new Error('config.primaryColumn not found');
        if (!config?.joinGroups) throw new Error('config.joinGroups not found');

        const { primaryColumn, joinGroups } = this.config;
        this.primaryColumn = primaryColumn;
        this.joinGroups = joinGroups;

        const { length } = this.joinGroups;
        for (let i = 0; i < length; i++) {
            const { outputColumn, referenceColumn, selectColumns } = this.joinGroups[i];

            this.defaultOutputGroups[outputColumn] = [];

            const selectOriginalColumns = selectColumns.map((column) => column.originalName);
            this.deleteColumnList = this.deleteColumnList.concat(referenceColumn, selectOriginalColumns);
        }
    }

    /**************************************************
     * Public Methods
     **************************************************/
    getOne(): T | undefined {
        if (!this.queryResult || this.queryResult.length === 0) {
            return undefined;
        }

        const newQueryResult = this.group();
        const isEmpty = newQueryResult.length === 0;

        return isEmpty ? undefined : newQueryResult[0];
    }
    getMany(): T[] {
        if (!this.queryResult || this.queryResult.length === 0) {
            return [];
        }

        const newQueryResult = this.group();

        return newQueryResult;
    }

    /**************************************************
     * Private Methods
     **************************************************/
    /**
     * 쿼리 결과에서 join row를 그룹화 시킨다.
     */
    private group(): T[] {
        const newQueryResult = [];

        let outputGroups = cloneDeep(this.defaultOutputGroups);

        const { length: queryResultLength } = this.queryResult;
        const lastIndex = queryResultLength - 1;
        const isDataOne = queryResultLength === 1;
        for (let currentIndex = 0; currentIndex < queryResultLength; currentIndex++) {
            const currentRow = this.queryResult[currentIndex];

            const isGreaterThanOrEqualTo = currentIndex >= lastIndex;
            const nextIndex = isGreaterThanOrEqualTo ? lastIndex : currentIndex + 1;
            const nextRow = this.queryResult[nextIndex];

            outputGroups = this.joinRowGrouping(currentRow, outputGroups);

            const isLastIndex = currentIndex === lastIndex;
            const isDifferentRow = currentRow[this.primaryColumn] !== nextRow[this.primaryColumn];
            if (isDataOne || isLastIndex || isDifferentRow) {
                const newCurrentRow = this.filterUnusedColumns(currentRow);
                const uniqOutputGroups = this.uniqGroupData(outputGroups);
                outputGroups = cloneDeep(this.defaultOutputGroups);

                newQueryResult.push({ ...newCurrentRow, ...uniqOutputGroups });
            }
        }

        return newQueryResult;
    }

    /**
     * join해서 가져온 row에서 outputColumn을 기준으로 각 column에 그룹화 작업을 한다.
     * @param {DynamicObject} row
     * @param {DynamicObject} outputGroups
     */
    private joinRowGrouping(row: DynamicObject, outputGroups: DynamicObject) {
        const newOutputGroups = { ...outputGroups };

        const { length: joinGroupsLength } = this.joinGroups;
        for (let i = 0; i < joinGroupsLength; i++) {
            const { outputColumn, referenceColumn, selectColumns } = this.joinGroups[i];

            if (row[referenceColumn]) {
                const columns = this.filterSelectColumns(row, selectColumns);
                newOutputGroups[outputColumn].push(columns);
            }
        }

        return newOutputGroups;
    }

    /**
     * join해서 가져온 row에서 selectColumns을 기준으로 필터해서 json key를 지정한다.
     * @param {DynamicObject} row
     * @param {SelectColumns[]} selectColumns
     */
    private filterSelectColumns(row: DynamicObject, selectColumns: SelectColumns[]) {
        const filterColumns = {};

        const { length } = selectColumns;
        for (let i = 0; i < length; i++) {
            const column = selectColumns[i];
            const columnName = column.changeName || column.originalName;
            filterColumns[columnName] = row[column.originalName];
        }

        return filterColumns;
    }

    /**
     * row에 columns에서 사용하지않는 column은 삭제 한다.
     * @param {DynamicObject} row
     */
    private filterUnusedColumns(row: DynamicObject) {
        const currentRow = { ...row };

        for (const column in currentRow) {
            if (this.deleteColumnList.includes(column)) {
                delete currentRow[column];
            }
        }

        return currentRow;
    }

    /**
     * 그룹화가 완료된 데이터에서 중복데이터를 제거 한다.
     * @param {DynamicObject} groupData
     */
    private uniqGroupData(groupData: DynamicObject) {
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
