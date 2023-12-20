export function isBoolean(value: any) {
    if (value === true || value === 1) {
        return true;
    }

    if (value === false || value === 0) {
        return true;
    }

    return false;
}
