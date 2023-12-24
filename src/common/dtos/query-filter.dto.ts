// @nestjs
import { PartialType } from '@nestjs/mapped-types';
// lib
import { IsInt, IsString, MaxLength, Max, Min } from 'class-validator';
// messages
import { HTTP_ERROR_MESSAGES } from '@common/messages';

// ----------------------------------------------------------------------

class QueryFilterValidation {
    @Max(4200000000, { message: HTTP_ERROR_MESSAGES['900'] })
    @IsInt({ message: HTTP_ERROR_MESSAGES['900'] })
    page: number;

    @Max(4200000000, { message: HTTP_ERROR_MESSAGES['900'] })
    @IsInt({ message: HTTP_ERROR_MESSAGES['900'] })
    itemSize: number;

    @MaxLength(10, { message: HTTP_ERROR_MESSAGES['900'] })
    @IsString({ message: HTTP_ERROR_MESSAGES['900'] })
    sort: string;

    @Max(5000, { message: HTTP_ERROR_MESSAGES['900'] })
    @Min(1, { message: HTTP_ERROR_MESSAGES['900'] })
    @IsInt({ message: HTTP_ERROR_MESSAGES['900'] })
    min: number;

    @Max(5000, { message: HTTP_ERROR_MESSAGES['900'] })
    @Min(1, { message: HTTP_ERROR_MESSAGES['900'] })
    @IsInt({ message: HTTP_ERROR_MESSAGES['900'] })
    max: number;
}

export class QueryFilterDto extends PartialType(QueryFilterValidation) {}
