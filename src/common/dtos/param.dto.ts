// lib
import { IsInt, MaxLength } from 'class-validator';
// messages
import { HTTP_ERROR_MESSAGES } from '@common/messages';

// ----------------------------------------------------------------------

// Param - :id
export class ParamIdStringDto {
    @MaxLength(20, { message: HTTP_ERROR_MESSAGES['900'] })
    id: string;
}
export class ParamIdNumberDto {
    @IsInt({ message: HTTP_ERROR_MESSAGES['900'] })
    id: number;
}

// Param - :guildId
export class ParamGuildIdDto {
    @MaxLength(20, { message: HTTP_ERROR_MESSAGES['900'] })
    guildId: string;
}

// Param - :type
export class ParamTypeDto {
    @MaxLength(20, { message: HTTP_ERROR_MESSAGES['900'] })
    type: string;
}

// Param - :type/:guildId
export class ParamTypeAndGuildIdDto {
    @MaxLength(20, { message: HTTP_ERROR_MESSAGES['900'] })
    guildId: string;

    @MaxLength(10, { message: HTTP_ERROR_MESSAGES['900'] })
    type: string;
}

// Param - :name
export class ParamNameDto {
    @MaxLength(20, { message: HTTP_ERROR_MESSAGES['900'] })
    name: string;
}

// Param - :keyword
export class ParamKeywordDto {
    @MaxLength(50, { message: HTTP_ERROR_MESSAGES['900'] })
    keyword: string;
}

// Param - :code
export class ParamCodeDto {
    @MaxLength(20, { message: HTTP_ERROR_MESSAGES['900'] })
    code: string;
}
