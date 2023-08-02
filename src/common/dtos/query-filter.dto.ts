// @nestjs
import { PartialType } from '@nestjs/mapped-types';
// lib
import { IsInt, IsString, MaxLength, Max, Min } from 'class-validator';
// messages
import { ERROR_MESSAGES } from '@common/messages';

// ----------------------------------------------------------------------

class QueryFilterValidation {
    @Max(4200000000, { message: ERROR_MESSAGES.E900 })
    @IsInt({ message: ERROR_MESSAGES.E900 })
    page: number;

    @Max(4200000000, { message: ERROR_MESSAGES.E900 })
    @IsInt({ message: ERROR_MESSAGES.E900 })
    itemSize: number;

    @MaxLength(10, { message: ERROR_MESSAGES.E900 })
    @IsString({ message: ERROR_MESSAGES.E900 })
    sort: string;

    @Max(5000, { message: ERROR_MESSAGES.E900 })
    @Min(1, { message: ERROR_MESSAGES.E900 })
    @IsInt({ message: ERROR_MESSAGES.E900 })
    min: number;

    @Max(5000, { message: ERROR_MESSAGES.E900 })
    @Min(1, { message: ERROR_MESSAGES.E900 })
    @IsInt({ message: ERROR_MESSAGES.E900 })
    max: number;
}

export class QueryFilterDto extends PartialType(QueryFilterValidation) {}
