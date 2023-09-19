export function isJson(value: any) {
    try {
        if (!value) return false;

        const type = typeof value;

        JSON.parse(JSON.stringify(value));

        return type === 'object';
    } catch {
        return false;
    }
}
