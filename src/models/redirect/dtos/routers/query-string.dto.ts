// lib
import { IsString, MaxLength } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
// messages
import { ERROR_MESSAGES } from '@common/messages';

// ----------------------------------------------------------------------

class QueryStringFilterValidation {
    @MaxLength(10, { message: ERROR_MESSAGES.E900 })
    @IsString({ message: ERROR_MESSAGES.E900 })
    redirect: string;

    @MaxLength(20, { message: ERROR_MESSAGES.E900 })
    @IsString({ message: ERROR_MESSAGES.E900 })
    guild_id: string;

    @MaxLength(100, { message: ERROR_MESSAGES.E900 })
    @IsString({ message: ERROR_MESSAGES.E900 })
    error: string;

    @IsString({ message: ERROR_MESSAGES.E900 })
    code: string;

    @IsString({ message: ERROR_MESSAGES.E900 })
    permissions: string;
}

export class RedirectQueryStringDto extends PartialType(QueryStringFilterValidation) {}
