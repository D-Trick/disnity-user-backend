/**
 * TypeOrm 대량 업데이트를 위한 CASE WHEN 쿼리문 Formatting
 * @param {any[]} ids
 * @param {object[]} values
 */
export const bulkUpdateQueryFormat = (ids: any[] = [], values: object[] = []) => {
    const { length: idsLength } = ids;
    const { length: valuesLength } = values;

    if (valuesLength === 0 || idsLength === 0) {
        throw new Error(`[BulkUpdate] 변경할 데이터 또는 컬럼이 없습니다. (${valuesLength} / ${idsLength})`);
    }
    if (valuesLength !== idsLength) {
        throw new Error(
            `[BulkUpdate] 변경할 데이터 수 와 변경할 컬럼에 데이터 수가 같지 않습니다. (${valuesLength} / ${idsLength})`,
        );
    }

    const bulkValues = {};
    const bulkParameters = {};

    for (const column in values[0]) {
        bulkValues[column] = '';
    }

    let sequence = 1;
    const startIndex = valuesLength - 1;
    for (let i = startIndex; i >= 0; i--) {
        const id = ids[i];
        const value = values[i];

        let startQuery = '';
        if (i === startIndex) {
            startQuery = 'CASE id';
        }

        let endQuery = '';
        if (i === 0) {
            endQuery = ' END';
        }

        for (const column in value) {
            const conditionalData = id;

            const originalValue = value[column];
            const isUndefined = originalValue === undefined;
            const parameter = isUndefined ? null : originalValue;

            bulkValues[column] += `${startQuery} WHEN ${conditionalData} THEN :data${sequence}${endQuery}`;
            bulkParameters[`data${sequence}`] = parameter;
            sequence++;
        }
    }

    const newBulkValues = { ...bulkValues };
    for (const column in bulkValues) {
        newBulkValues[column] = () => bulkValues[column];
    }

    return {
        bulkValues: newBulkValues,
        bulkParameters,
    };
};
