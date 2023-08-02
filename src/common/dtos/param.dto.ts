// lib
import { IsISO8601, IsInt, Length, MaxLength } from 'class-validator';
// messages
import { ERROR_MESSAGES } from '@common/messages';

// ----------------------------------------------------------------------

// Param - :id
export class ParamIdStringDto {
    @MaxLength(20, { message: ERROR_MESSAGES.E900 })
    id: string;
}
export class ParamIdNumberDto {
    @IsInt({ message: ERROR_MESSAGES.E900 })
    id: number;
}

// Param - :guildId
export class ParamGuildIdDto {
    @MaxLength(20, { message: ERROR_MESSAGES.E900 })
    guildId: string;
}

// Param - :type
export class ParamTypeDto {
    @MaxLength(10, { message: ERROR_MESSAGES.E900 })
    type: string;
}

// Param - :name
export class ParamNameDto {
    @MaxLength(20, { message: ERROR_MESSAGES.E900 })
    name: string;
}

// Param - :keyword
export class ParamKeywordDto {
    @MaxLength(50, { message: ERROR_MESSAGES.E900 })
    keyword: string;
}

// Param - :code
export class ParamCodeDto {
    @MaxLength(20, { message: ERROR_MESSAGES.E900 })
    code: string;
}

/**
 * Param
 * :start
 * :end
 */
export class ParamScheduledDateDto {
    @IsISO8601({ strict: true }, { message: ERROR_MESSAGES.E900 })
    @Length(10, 10, { message: ERROR_MESSAGES.E900 })
    start: string;

    @IsISO8601({ strict: true }, { message: ERROR_MESSAGES.E900 })
    @Length(10, 10, { message: ERROR_MESSAGES.E900 })
    end: string;
}
