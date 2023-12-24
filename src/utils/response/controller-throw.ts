// @nestjs
import { HttpException } from '@nestjs/common';
// utils
import { formatHttpDefaultMessage } from './format-http-default-message';

// ----------------------------------------------------------------------

/**
 * Controller 전용 Throw
 * @param {any} error
 */
export function controllerThrow(error: any) {
    if (error instanceof HttpException) {
        error.message = formatHttpDefaultMessage(error.getStatus(), error.message);
    }

    throw error;
}
