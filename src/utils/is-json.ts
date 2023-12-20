/**
 * Json 구조인지 확인
 * @param {any} value
 */
export function isJson(value: any) {
    try {
        const isEmpty = !value;
        if (isEmpty) {
            return false;
        }

        JSON.parse(JSON.stringify(value));

        return typeof value === 'object';
    } catch {
        return false;
    }
}
