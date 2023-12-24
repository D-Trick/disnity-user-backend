// @nestjs
import { ExceptionFilter, Catch, ArgumentsHost, Logger } from '@nestjs/common';
// lib
import { Response } from 'express';
import { instanceToPlain } from 'class-transformer';
// utils
import { ErrorResponse } from '@utils/response/error-response';
// exceptions
import { DiscordApiException } from '@exceptions/discord-api.exception';

// ----------------------------------------------------------------------

@Catch(DiscordApiException)
export class DiscordApiExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(DiscordApiExceptionFilter.name);

    catch(exception: DiscordApiException, host: ArgumentsHost) {
        const response = host.switchToHttp().getResponse<Response>();

        const statusCode = exception.statusCode;
        const message = exception.message;

        this.logger.error(`${statusCode} - ${exception.url} | ${exception.message}`, exception.stack);

        response.status(statusCode).json(instanceToPlain(ErrorResponse.create(statusCode, message)));
    }
}
