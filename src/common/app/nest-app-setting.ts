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
import { cookieParserOptions } from '@config/cookie.config';
import { validationPipeConfig } from '@config/validation-pipe.config';

// ----------------------------------------------------------------------

export function nestAppSetting<T extends INestApplication>(app: T): void {
    app.use(cookieParser(cookieParserOptions.secret));

    app.useGlobalPipes(new ValidationPipe(validationPipeConfig));

    app.useGlobalFilters(
        new GlobalExceptionFilter(),
        new HttpExceptionFilter(),
        new NotFoundExceptionFilter(),
        new UnauthorizedExceptionFilter(),
        new DiscordApiExceptionFilter(),
    );

    app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
}
