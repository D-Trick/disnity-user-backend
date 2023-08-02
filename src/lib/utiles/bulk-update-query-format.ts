/**
 * TypeOrm 대량 업데이트를 위한 CASE WHEN 쿼리문 Formatting
 * @param {any[]} ids
 * @param {object[]} values
 */
export const bulkUpdateQueryFormat = (ids: any[], values: object[]) => {
    const idsLength = ids.length;
    const valuesLength = values.length;
    if (valuesLength === 0 || idsLength === 0) {
        throw new Error(`[BulkUpdate] 변경할 데이터 또는 컬럼이 없습니다. (${valuesLength} / ${idsLength})`);
    }
    if (valuesLength !== idsLength) {
        throw new Error(
            `[BulkUpdate] 변경할 데이터 수 와 변경할 컬럼에 데이터 수가 같지 않습니다. (${valuesLength} / ${idsLength})`,
        );
    }

    // CASE문 Formatting
    const bulkValues = {};
    const length = valuesLength - 1;
    for (let i = length; i >= 0; i--) {
        const id = ids[i];
        const value = values[i];

        let startQuery = '';
        let endQuery = '';
        // 시작쿼리 문자열 삽입
        if (i === length) {
            // key 초기화
            for (const key in value) {
                bulkValues[key] = '';
            }
            startQuery = 'CASE id';
        }
        // 마지막쿼리 문자열 삽입
        if (i === 0) endQuery = ' END';

        // CASE WHEN 쿼리 문자열 생성
        for (const key in value) {
            let conditionalData = '';
            let data = '';

            const typeofId = typeof id;
            if (typeofId === 'string') {
                conditionalData = `'${id}'`;
            } else {
                conditionalData = id;
            }

            const originalValue = value[key];
            const typeofValue = typeof originalValue;
            if (typeofValue === 'string') {
                data = `'${originalValue}'`;
            } else if (typeofValue === 'function') {
                data = originalValue();
            } else if (originalValue === undefined) {
                data = null;
            } else {
                data = originalValue;
            }

            bulkValues[key] += `${startQuery} WHEN ${conditionalData} THEN ${data}${endQuery}`;
        }
    }

    // typeorm update문에 맞게 formatting
    for (const key in bulkValues) {
        const rawQuery = bulkValues[key];
        bulkValues[key] = () => rawQuery;
    }

    return bulkValues;
};
