// @nestjs
import { HttpException, HttpStatus } from '@nestjs/common';

// ----------------------------------------------------------------------

export class TooManyRequestsException extends HttpException {
    constructor(message?: string | object | any, error = 'Too Many Requests') {
        super(HttpException.createBody(message, error, HttpStatus.TOO_MANY_REQUESTS), HttpStatus.TOO_MANY_REQUESTS);
    }
}
