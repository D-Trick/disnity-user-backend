// @nestjs
import { HttpStatus } from '@nestjs/common';
// lib
import { Exclude, Expose } from 'class-transformer';

// ----------------------------------------------------------------------

export class ErrorResponse {
    @Exclude() private readonly _statusCode: number; // Http Status
    @Exclude() private readonly _error: string; // Http 기본 Error ex) Bad Request
    @Exclude() private readonly _message: string; // Custom Error Message

    private constructor(statusCode: HttpStatus, message: string) {
        this._statusCode = statusCode;
        this._error = HttpStatus[`${statusCode}`];
        this._message = message;
    }

    static create(status: HttpStatus, message: string): ErrorResponse {
        return new ErrorResponse(status, message);
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
}
