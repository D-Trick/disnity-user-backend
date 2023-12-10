// lib
import { MaxLength, Matches } from 'class-validator';
// messages
import { SERVER_MESSAGES } from '@common/messages';

// ----------------------------------------------------------------------

export class TagsDto {
    @MaxLength(10, { message: SERVER_MESSAGES.TAG_NAME_MAX_LENGTH })
    @Matches(/^[^#|/|&|?|\\|*|@|%|+| ]*$/, { message: SERVER_MESSAGES.TAG_NAME_FILTER })
    name: string;
}
