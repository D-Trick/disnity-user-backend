/**
 * 배열로 넘어온 값들이 전부 비어있는지 체크
 * @param {any[]} array
 */
export const isAllEmpty = (array: any[]): boolean => {
    if (!array.length) return true;

    let isAllEmpty = true;
    for (let i = array.length - 1; i >= 0; i--) {
        const value = array[i];

        let currentIsEmpty = false;
        if (!value) {
            currentIsEmpty = true;
        } else if (Array.isArray(value)) {
            currentIsEmpty = !value.length;
        } else if (typeof value === 'object') {
            currentIsEmpty = !Object.keys(value).length;
        }

        isAllEmpty = currentIsEmpty ? isAllEmpty : false;
    }

    return isAllEmpty;
};
