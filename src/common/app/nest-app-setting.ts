// @nestjs
import { Reflector } from '@nestjs/core';
import { ClassSerializerInterceptor, INestApplication, ValidationPipe } from '@nestjs/common';
// lib
import cookieParser from 'cookie-parser';
// exceptions
import { HttpExceptionFilter } from '@exceptions/filters/http.exception.filter';
import { GlobalExceptionFilter } from '@exceptions/filters/global.exception.filter';
import { NotFoundExceptionFilter } from '@exceptions/filters/not-found.exception.filter';
import { DiscordApiExceptionFilter } from '@exceptions/filters/discord-api.exception.filter';
import { UnauthorizedExceptionFilter } from '@exceptions/filters/unauthorized.exception.filter';
// configs
import { COOKIE_PARSER_OPTIONS } from '@config/cookie.config';
import { VALIDATION_PIPE_CONFIG } from '@config/validation-pipe.config';

// ----------------------------------------------------------------------

export function nestAppSetting<T extends INestApplication>(app: T): void {
    app.use(cookieParser(COOKIE_PARSER_OPTIONS.secret));

    app.useGlobalPipes(new ValidationPipe(VALIDATION_PIPE_CONFIG));

    app.useGlobalFilters(
        new GlobalExceptionFilter(),
        new HttpExceptionFilter(),
        new NotFoundExceptionFilter(),
        new UnauthorizedExceptionFilter(),
        new DiscordApiExceptionFilter(),
    );

    app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
}
