// @nestjs
import { ExceptionFilter, Catch, ArgumentsHost, HttpException, Logger } from '@nestjs/common';
// lib
import { Response } from 'express';
import { instanceToPlain } from 'class-transformer';
// utils
import { ErrorResponse } from '@utils/response/error-response';
// messages
import { HTTP_ERROR_MESSAGES } from '@common/messages';

// ----------------------------------------------------------------------

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(GlobalExceptionFilter.name);

    catch(exception: HttpException, host: ArgumentsHost) {
        const request = host.switchToHttp().getRequest<Request>();
        const response = host.switchToHttp().getResponse<Response>();

        const statusCode = 500;
        const message = HTTP_ERROR_MESSAGES['500'];

        this.logger.error(`${statusCode} - ${request.url} | ${exception.message}`, exception.stack);

        response.status(statusCode).json(instanceToPlain(ErrorResponse.create(statusCode, message)));
    }
}
