/**
 * CASE WHEN을 사용한 대량 업데이트 쿼리문 생성
 * @param {any[]} ids
 * @param {object[]} values
 */
export const generateBulkUpdateQuery = (ids: any[] = [], values: object[] = []) => {
    const { length: idsLength } = ids;
    const hasIds = !!idsLength;
    const { length: valuesLength } = values;
    const hasValues = !!valuesLength;

    if (!hasIds) {
        throw new Error(`[BulkUpdate] 업데이트시킬 컬럼이 없습니다.`);
    }
    if (!hasValues) {
        throw new Error(`[BulkUpdate] 업데이트시킬 데이터가 없습니다.`);
    }
    if (valuesLength !== idsLength) {
        throw new Error(
            `[BulkUpdate] 업데이트시킬 데이터와 컬럼의 개수가 같지 않습니다. (${valuesLength} / ${idsLength})`,
        );
    }

    const bulkValues: { [key: string]: any } = {};
    const bulkParameters: { [key: string]: any } = {};

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

            const isUndefined = value[column] === undefined;
            const parameter = isUndefined ? null : value[column];

            if (typeof parameter === 'function') {
                bulkValues[column] += `${startQuery} WHEN ${conditionalData} THEN ${parameter()}${endQuery}`;
            } else {
                bulkValues[column] += `${startQuery} WHEN ${conditionalData} THEN :data${sequence}${endQuery}`;
                bulkParameters[`data${sequence}`] = parameter;
                sequence++;
            }
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
