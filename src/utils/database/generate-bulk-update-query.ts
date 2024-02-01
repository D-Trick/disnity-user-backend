interface DynamicObject {
    [key: string]: any;
}

interface Options {
    parameterSequence: number;
    column: string;
    id: number | string;
    value: DynamicObject;
}

// ----------------------------------------------------------------------

/**
 * CASE WHEN을 사용한 대량 업데이트 SQL 생성
 * @param {any[]} ids
 * @param {object[]} values
 */
export const generateBulkUpdateQuery = (ids: (string | number)[] = [], values: DynamicObject[] = []) => {
    validation(ids, values);

    let bulkParameters: DynamicObject = {};
    const bulkValues: DynamicObject = {};
    const columns = Object.keys(values[0]);

    const { length: valuesLength } = values;
    for (let index = 0; index < valuesLength; index++) {
        const id = ids[index];
        const value = values[index];

        columns.map((column) => {
            const { sql, parameter } = generateCaseWhenSql({
                parameterSequence: index + 1,
                column,
                id,
                value,
            });

            bulkValues[column] += sql;
            bulkParameters = Object.assign(bulkParameters, parameter);
        });
    }

    return {
        bulkValues: bulkValuesSetting(columns, bulkValues),
        bulkParameters,
    };
};

/**
 * 유효성 검사
 * @param {(string | number)[]} ids
 * @param {DynamicObject[]} values
 */
function validation(ids: (string | number)[], values: DynamicObject[]) {
    const idsLength = ids.length;
    const hasIds = !!idsLength;
    if (!hasIds) {
        throw new Error(`[BulkUpdate] 업데이트시킬 컬럼이 없습니다.`);
    }

    const valuesLength = values.length;
    const hasValues = !!valuesLength;
    if (!hasValues) {
        throw new Error(`[BulkUpdate] 업데이트시킬 데이터가 없습니다.`);
    }

    if (valuesLength !== idsLength) {
        throw new Error(
            `[BulkUpdate] 업데이트시킬 데이터와 컬럼의 개수가 같지 않습니다. (${valuesLength} / ${idsLength})`,
        );
    }
}

/**
 * id를 조건부로 case when sql문을 생성한다.
 * @param {Options} options
 * @example
 * // parameter {
 *     parameterSequence: 1,
 *     column: 'name',
 *     id: 99999
 *     value: { name: '이름1' }
 * }
 *
 * // return {
 *    sql: 'WHEN 99999 THEN :name1',
 *    parameter: {
 *        name1: '이름1',
 *    }
 * }
 */
function generateCaseWhenSql({ parameterSequence, column, id, value }: Options) {
    let sql = '';
    const parameter: DynamicObject = {};

    const isUndefined = value[column] === undefined;
    const columnValue = isUndefined ? null : value[column];

    if (typeof columnValue === 'function') {
        sql = `WHEN ${id} THEN ${columnValue()} `;
    } else {
        sql = `WHEN ${id} THEN :${column}${parameterSequence} `;
        parameter[`${column}${parameterSequence}`] = columnValue;
    }

    return {
        sql,
        parameter,
    };
}

/**
 * 최종적으로 bulkValues에 데이터를 가공 한다.
 * @param {string[]} columns
 * @param {DynamicObject} bulkValues
 */
function bulkValuesSetting(columns: string[], bulkValues: DynamicObject) {
    const tempBulkValues = { ...bulkValues };

    const { length } = columns;
    for (let i = 0; i < length; i++) {
        const column = columns[i];

        const filterSql = tempBulkValues[column].replace(/undefined/g, '');

        tempBulkValues[column] = () => `CASE id ${filterSql}END`;
    }

    return tempBulkValues;
}
