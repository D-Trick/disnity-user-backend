import { isJson } from './is-json';

export function isNotJson(value: any) {
    return !isJson(value);
}
