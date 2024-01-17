// lib
import { IsInt, MaxLength } from 'class-validator';
// messages
import { HTTP_ERROR_MESSAGES } from '@common/messages';

// ----------------------------------------------------------------------

// Param - :id
export class ParamIdStringRequestDto {
    @MaxLength(20, { message: HTTP_ERROR_MESSAGES['900'] })
    id: string;
}
export class ParamIdNumberRequestDto {
    @IsInt({ message: HTTP_ERROR_MESSAGES['900'] })
    id: number;
}

// Param - :guildId
export class ParamGuildIdRequestDto {
    @MaxLength(20, { message: HTTP_ERROR_MESSAGES['900'] })
    guildId: string;
}

// Param - :type
export class ParamTypeRequestDto {
    @MaxLength(20, { message: HTTP_ERROR_MESSAGES['900'] })
    type: string;
}

// Param - :type/:guildId
export class ParamTypeAndGuildIdRequestDto {
    @MaxLength(20, { message: HTTP_ERROR_MESSAGES['900'] })
    guildId: string;

    @MaxLength(10, { message: HTTP_ERROR_MESSAGES['900'] })
    type: string;
}

// Param - :name
export class ParamNameRequestDto {
    @MaxLength(20, { message: HTTP_ERROR_MESSAGES['900'] })
    name: string;
}

// Param - :keyword
export class ParamKeywordRequestDto {
    @MaxLength(50, { message: HTTP_ERROR_MESSAGES['900'] })
    keyword: string;
}

// Param - :code
export class ParamCodeRequestDto {
    @MaxLength(20, { message: HTTP_ERROR_MESSAGES['900'] })
    code: string;
}
