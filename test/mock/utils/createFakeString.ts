export function createFakeString(char: string = 'a', length: number = 0) {
    let string = '';

    for (let i = 0; i < length; i++) {
        string += char;
    }

    return string;
}
