import { isJson } from './isJson';

export function isNotJson(value: any) {
    return !isJson(value);
}
