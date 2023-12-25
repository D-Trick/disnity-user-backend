// @nestjs
import { ExceptionFilter, Catch, ArgumentsHost, HttpException, Logger, UnauthorizedException } from '@nestjs/common';
// lib
import { Response } from 'express';
import { instanceToPlain } from 'class-transformer';
// utils
import { ErrorResponse } from '@utils/response/error-response';
import { AUTH_ERROR_MESSAGES } from '@common/messages';

// ----------------------------------------------------------------------

@Catch(UnauthorizedException)
export class UnauthorizedExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(UnauthorizedExceptionFilter.name);

    catch(exception: HttpException, host: ArgumentsHost) {
        const request = host.switchToHttp().getRequest<Request>();
        const response = host.switchToHttp().getResponse<Response>();

        const statusCode = exception.getStatus();
        const message = exception.message;

        if (this.shouldLogMessage(message)) {
            this.logger.error(`${statusCode} - ${request.url} | ${exception.message}`, exception.stack);
        }

        response
            .status(statusCode)
            .json(instanceToPlain(ErrorResponse.create(statusCode, message, exception.getResponse())));
    }

    private shouldLogMessage(message: string) {
        if (message === AUTH_ERROR_MESSAGES.LOGIN_PLEASE) {
            return false;
        }

        return true;
    }
}
