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
// ----------------------------------------------------------------------

export class ErrorResponse {
    @Exclude() private readonly _statusCode: number; // Http Status
    @Exclude() private readonly _error: string; // Http 기본 Error ex) Bad Request
    @Exclude() private readonly _message: string; // Custom Error Message
    @Exclude() private readonly _information: any; // Custom Error Information

    private constructor(statusCode: HttpStatus, message: string, information?: string | DynamicObject) {
        this._statusCode = statusCode;
        this._error = HttpStatus[`${statusCode}`];
        this._message = message;

        const newInformation = this.unUsedInformationKeyRemove(information);
        this._information = isEmpty(newInformation) ? undefined : newInformation;
    }

    static create(status: HttpStatus, message: string, information?: string | DynamicObject): ErrorResponse {
        return new ErrorResponse(status, message, information);
    }

    private unUsedInformationKeyRemove(information: any) {
        const newInformation = { ...information };

        if (typeof newInformation === 'object') {
            delete newInformation?.statusCode;
            delete newInformation?.error;
            delete newInformation?.message;
        }

        return newInformation;
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
    get information(): string {
        return this._information;
    }
}
