/**
 * 배열로 넘어온 값들이 전부 비어있는지 체크
 * @param {(string | number)[]} array
 */
export const isAllEmpty = (array: (string | number)[]): boolean => {
    let isAllEmpty = true;

    const { length } = array;
    for (let i = 0; i < length; i++) {
        const value = array[i];

        const isEmpty = !value;
        const isNotString = typeof value !== 'string';
        const isNotNumber = typeof value !== 'number';

        if (!isEmpty && isNotString && isNotNumber) {
            throw new Error('값의 Type이 string 또는 number가 아닙니다.');
        }

        let currentIsEmpty = false;
        if (isEmpty) {
            currentIsEmpty = true;
        }

        isAllEmpty = currentIsEmpty ? isAllEmpty : false;
    }

    return isAllEmpty;
};
