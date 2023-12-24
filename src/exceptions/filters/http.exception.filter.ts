// @nestjs
import { ExceptionFilter, Catch, ArgumentsHost, HttpException, Logger } from '@nestjs/common';
// lib
import { Response } from 'express';
import { instanceToPlain } from 'class-transformer';
// utils
import { ErrorResponse } from '@utils/response/error-response';

// ----------------------------------------------------------------------

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(HttpExceptionFilter.name);

    catch(exception: HttpException, host: ArgumentsHost) {
        const request = host.switchToHttp().getRequest<Request>();
        const response = host.switchToHttp().getResponse<Response>();

        const statusCode = exception.getStatus();
        const message = exception.message;

        this.logger.error(`${statusCode} - ${request.url} | ${exception.message}`, exception.stack);

        response.status(statusCode).json(instanceToPlain(ErrorResponse.create(statusCode, message)));
    }
}
