export async function promiseAllSettled(promises: any[]) {
    const result = await Promise.allSettled(promises);

    const errors: any = result.filter((r) => r.status === 'rejected');
    const isError = errors.length > 0;
    if (isError) {
        throw new Error(errors[0].reason);
    }

    const resultValues = result.map((r: any) => {
        return r?.value ? r?.value : undefined;
    });

    return resultValues;
}
