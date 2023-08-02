// lib
import { IsString, MaxLength } from 'class-validator';
// messages
import { ERROR_MESSAGES } from '@common/messages';

// ----------------------------------------------------------------------

export class ParamTypeDto {
    @MaxLength(20, { message: ERROR_MESSAGES.E900 })
    @IsString({ message: ERROR_MESSAGES.E900 })
    type: string;
}
