// @nestjs
import { ExceptionFilter, Catch, ArgumentsHost, HttpException, Logger, NotFoundException } from '@nestjs/common';
// lib
import { Response } from 'express';
import { instanceToPlain } from 'class-transformer';
// utils
import { ErrorResponse } from '@utils/response/error-response';

// ----------------------------------------------------------------------

@Catch(NotFoundException)
export class NotFoundExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(NotFoundException.name);

    catch(exception: HttpException, host: ArgumentsHost) {
        const request = host.switchToHttp().getRequest<Request>();
        const response = host.switchToHttp().getResponse<Response>();

        const statusCode = exception.getStatus();
        const message = exception.message;

        this.logger.log(`${statusCode} - ${request.url} | ${exception.message}`);

        response.status(statusCode).json(instanceToPlain(ErrorResponse.create(statusCode, message)));
    }
}
