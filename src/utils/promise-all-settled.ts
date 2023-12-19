/**
 * Promise.allSettled를 Promise.all처럼 값을 반환하게 변경
 * @param {Promise<any>} promises
 */
export async function promiseAllSettled(promises: Promise<any>[]) {
    const result = await Promise.allSettled(promises);

    const errors: any = result.filter((r) => r.status === 'rejected');
    const isError = errors.length > 0;
    if (isError) {
        throw new Error(errors[0].reason);
    }

    const resultValues = result.map((r: any) => {
        if (!!r?.value) {
            return r?.value;
        }

        return undefined;
    });

    return resultValues;
}
