// messages
import { HTTP_ERROR_MESSAGES, HTTP_ERROR_DEFAULT_MESSAGES } from '@common/messages';

// ----------------------------------------------------------------------

/**
 * HttpException의 status code별 기본메시지를 커스텀 메시지로 포맷
 * @param {number} statusCode
 * @param {string} message
 */
export function formatHttpDefaultMessage(statusCode: number, message: string) {
    let defaultMessage = '';
    switch (statusCode) {
        case 400:
        case 401:
        case 403:
        case 429:
        case 500:
            defaultMessage = HTTP_ERROR_DEFAULT_MESSAGES[`${statusCode}`];
            break;
        default:
            defaultMessage = '';
    }

    const isDefaultMessage = message === defaultMessage;

    return isDefaultMessage ? HTTP_ERROR_MESSAGES[`${statusCode}`] : message;
}
