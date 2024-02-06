// @nestjs
import { HttpException } from '@nestjs/common';
// messages
import { HTTP_ERROR_DEFAULT_MESSAGES, HTTP_ERROR_MESSAGES } from '@common/messages';

// ----------------------------------------------------------------------

export class ControllerException {
    private _error: any;

    /**************************************************
     * Constructor
     **************************************************/
    constructor(error: any) {
        this._error = error;

        return this.error();
    }

    /**************************************************
     * Private Methods
     **************************************************/
    private error() {
        if (this._error instanceof HttpException) {
            this._error.message = this.formatHttpDefaultMessage(this._error.getStatus(), this._error.message);
        }

        return this._error;
    }

    private formatHttpDefaultMessage(statusCode: number, message: string) {
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
        if (isDefaultMessage) {
            return HTTP_ERROR_MESSAGES[`${statusCode}`];
        }

        return message;
    }
}
