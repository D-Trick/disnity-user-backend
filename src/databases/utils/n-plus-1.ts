/**************************************************/
export interface Config {
    primaryColumnName: string;
    joinGroups: JoinGroup[];
}

interface JoinGroup {
    outputColumnName: string;
    referencedColumnName: string;
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
export default class Nplus1 {
    /**************************************************
     * Constructor
     **************************************************/
    constructor(
        private queryResult: any[],
        private configs: Config,
    ) {}

    /**************************************************
     * Public Methods
     **************************************************/
    async getOne<T = any>() {
        const newQueryResult = this.format() as T[];
        return newQueryResult.length === 0 ? undefined : newQueryResult[0];
    }
    async getMany<T = any>() {
        const newQueryResult = this.format() as T[];
        return newQueryResult;
    }

    /**************************************************
     * Private Methods
     **************************************************/
    /**
     * N + 1 Group Format
     */
    private format() {
        let groups = {};
        const newQueryResult = [];
        const primaryColumnName = this.configs.primaryColumnName;

        const queryResultLength = this.queryResult.length;
        for (let i = 0; i < queryResultLength; i++) {
            const queryResultLastIndex = queryResultLength - 1;
            const queryResultNextIndex = i === queryResultLastIndex ? i : i + 1;

            const raw = this.queryResult[i];
            const nextRaw = this.queryResult[queryResultNextIndex];

            const joinGroups = this.configs.joinGroups;
            const joinGroupsLength = joinGroups.length;
            for (let j = 0; j < joinGroupsLength; j++) {
                const joinGroup = joinGroups[j];
                const isJoinGroupLastIndex = j === joinGroupsLength - 1;

                const outputColumnName = joinGroup.outputColumnName;
                const referencedColumnName = joinGroup.referencedColumnName;

                if (!groups[outputColumnName]) groups[outputColumnName] = [];

                const primaryColumn = raw[primaryColumnName];
                const nextPrimaryColumn = nextRaw[primaryColumnName];
                const referencedColumn = raw[referencedColumnName];
                if (primaryColumn === nextPrimaryColumn && i !== queryResultLastIndex) {
                    if (referencedColumn) {
                        const selectColumn = this.selectColumnsFormat({
                            raw,
                            selectColumns: joinGroup.selectColumns,
                        });
                        groups[outputColumnName].push(selectColumn);
                    }
                } else {
                    if (referencedColumn) {
                        const selectColumn = this.selectColumnsFormat({
                            raw,
                            selectColumns: joinGroup.selectColumns,
                        });
                        groups[outputColumnName].push(selectColumn);
                        groups[outputColumnName] = this.uniqJsonArray(groups[outputColumnName]);
                    }

                    if (isJoinGroupLastIndex) {
                        const newResult = this.columnNamesDelete(raw);
                        newQueryResult.push({ ...newResult, ...groups });
                        groups = [];
                    }
                }
            }
        }

        return newQueryResult;
    }

    /**
     * Select Column명을 변경하고 Json형태로 return
     * e.g. selectColumns: [ { original: '원래컬럼명', change: '바꿀컬럼명' }, ]
     * @param {SelectColumns} selectColumns
     * @param {any} raw
     */
    private selectColumnsFormat({ raw, selectColumns }: DynamicObject) {
        const json: DynamicObject = {};
        const SelectColumnsLength = selectColumns.length;
        for (let i = 0; i < SelectColumnsLength; i++) {
            const selectColumn = selectColumns[i];

            const originalName = selectColumn.originalName;
            const changeName = selectColumn.changeName || originalName;
            json[changeName] = raw[originalName];
        }

        return json;
    }

    /**
     * 표시하지않을 컬럼명 제거
     * @param {any} raw
     */
    private columnNamesDelete(raw: any): any {
        const json = { ...raw };

        for (let i = this.configs.joinGroups.length - 1; i >= 0; i--) {
            const joinGroup = this.configs.joinGroups[i];

            delete json[joinGroup.referencedColumnName];

            const selectColumns = joinGroup.selectColumns;
            for (let j = selectColumns.length - 1; j >= 0; j--) {
                const selectColumn = selectColumns[j];

                delete json[selectColumn.originalName];
            }
        }

        return json;
    }

    /**
     * 그룹화된 데이터 중복제거
     * @param {DynamicObject[]} jsonArray
     */
    private uniqJsonArray(jsonArray: DynamicObject[]) {
        const jsonArrayStringify = jsonArray.map((json) => JSON.stringify(json));
        const setJsonArray = [...new Set(jsonArrayStringify)];

        const uniqJsonArray = setJsonArray.map((json) => JSON.parse(json));

        return uniqJsonArray;
    }
}
