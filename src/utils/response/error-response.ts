// @nestjs
import { HttpStatus } from '@nestjs/common';
// lodash
import isEmpty from 'lodash/isEmpty';
// lib
import { Exclude, Expose } from 'class-transformer';

// ----------------------------------------------------------------------
interface DynamicObject {
    [key: string]: any;
}

interface Information {
    auth?: string;
    isRedirect?: boolean;
    message?: string;
}
// ----------------------------------------------------------------------

export class ErrorResponse {
    @Exclude() private readonly _statusCode: number; // Http Status
    @Exclude() private readonly _error: string; // Http 기본 Error ex) Bad Request
    @Exclude() private readonly _message: string; // Error Message And Custom Error Message
    @Exclude() private readonly _information: Information | undefined; // Custom Error Information

    private constructor(statusCode: HttpStatus, message: string, information?: string | DynamicObject) {
        this._statusCode = statusCode;
        this._error = HttpStatus[`${statusCode}`];
        this._message = message;

        const newInformation = this.informationSetting(information);
        this._information = isEmpty(newInformation) ? undefined : newInformation;
    }

    static create(status: HttpStatus, message: string, information?: string | DynamicObject): ErrorResponse {
        return new ErrorResponse(status, message, information);
    }

    private informationSetting(information?: string | DynamicObject) {
        if (typeof information === 'object') {
            return this.json<Information>({
                auth: information?.auth,
                isRedirect: information?.isRedirect,
            });
        }

        if (typeof information === 'string') {
            return this.json<Information>({
                message: information,
            });
        }

        return undefined;
    }

    private json<T = any>(value: any): T {
        return JSON.parse(JSON.stringify(value));
    }

    @Expose()
    get statusCode(): number {
        return this._statusCode;
    }

    @Expose()
    get error(): string {
        return this._error;
    }

    @Expose()
    get message(): string {
        return this._message;
    }

    @Expose()
    get information(): Information | undefined {
        return this._information;
    }
}
