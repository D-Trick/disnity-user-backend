// lib
import { MaxLength, Matches } from 'class-validator';
// messages
import { SERVER_ERROR_MESSAGES } from '@common/messages';

// ----------------------------------------------------------------------

export class TagsDto {
    @MaxLength(10, { message: SERVER_ERROR_MESSAGES.TAG_NAME_MAX_LENGTH })
    @Matches(/^[^#|/|&|?|\\|*|@|%|+| ]*$/, { message: SERVER_ERROR_MESSAGES.INVALID_TAG_NAME_CHARS })
    name: string;
}
