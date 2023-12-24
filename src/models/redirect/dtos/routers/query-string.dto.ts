// @nestjs
import { PartialType } from '@nestjs/mapped-types';
// lib
import { Allow, IsString, MaxLength } from 'class-validator';
// messages
import { HTTP_ERROR_MESSAGES } from '@common/messages';

// ----------------------------------------------------------------------

class QueryStringFilterValidation {
    @MaxLength(10, { message: HTTP_ERROR_MESSAGES['900'] })
    @IsString({ message: HTTP_ERROR_MESSAGES['900'] })
    redirect: string;

    @MaxLength(20, { message: HTTP_ERROR_MESSAGES['900'] })
    @IsString({ message: HTTP_ERROR_MESSAGES['900'] })
    guild_id: string;

    @MaxLength(100, { message: HTTP_ERROR_MESSAGES['900'] })
    @IsString({ message: HTTP_ERROR_MESSAGES['900'] })
    error: string;

    @IsString({ message: HTTP_ERROR_MESSAGES['900'] })
    code: string;

    @IsString({ message: HTTP_ERROR_MESSAGES['900'] })
    permissions: string;

    @Allow()
    error_description: string;
}

export class RedirectQueryStringDto extends PartialType(QueryStringFilterValidation) {}
