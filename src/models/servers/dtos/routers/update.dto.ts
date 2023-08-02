// lib
import {
    IsString,
    MaxLength,
    Max,
    Min,
    ValidateIf,
    IsNotEmpty,
    Allow,
    IsNumberString,
    IsIn,
    IsUrl,
    ValidateNested,
    Matches,
} from 'class-validator';
import { Type } from 'class-transformer';
// messages
import { SERVER_MESSAGES, ERROR_MESSAGES } from '@common/messages';

// ----------------------------------------------------------------------
class TagsDto {
    @MaxLength(10, { message: SERVER_MESSAGES.TAG_NAME_MAX_LENGTH })
    @Matches(/^[^#|/|&|?|\\|*|@|%|+| ]*$/, { message: SERVER_MESSAGES.TAG_NAME_FILTER })
    name: string;
}
// ----------------------------------------------------------------------

export class UpdateDto {
    @IsIn(['public', 'private'], { message: SERVER_MESSAGES.BAD_SERVER_OPEN })
    serverOpen: 'public' | 'private';

    @Max(65535, { message: SERVER_MESSAGES.CATEGORY_NOT_FOUND })
    @Min(1, { message: SERVER_MESSAGES.CATEGORY_NOT_FOUND })
    categoryId: number;

    @IsIn(['invite', 'membership'], { message: SERVER_MESSAGES.BAD_LINK_TYPE })
    linkType: 'invite' | 'membership';

    @IsIn(['auto', 'manual'], { message: SERVER_MESSAGES.BAD_INVITE_AUTO })
    inviteAuto: 'auto' | 'manual';

    @MaxLength(15, { message: SERVER_MESSAGES.INVITE_MAX_LENGTH })
    @IsString({ message: SERVER_MESSAGES.INVITE_EMPTY })
    @IsNotEmpty({ message: SERVER_MESSAGES.INVITE_EMPTY })
    @ValidateIf((o) => {
        return o.linkType === 'invite' && o.inviteAuto === 'manual';
    })
    inviteCode: string;

    @MaxLength(22, { message: SERVER_MESSAGES.CHANNEL_NOT_FOUND })
    @IsNumberString({ no_symbols: true }, { message: SERVER_MESSAGES.CHANNEL_NOT_FOUND })
    @ValidateIf((o) => {
        return o.linkType === 'invite' && o.inviteAuto === 'auto';
    })
    channelId: string;

    @IsUrl(
        { protocols: ['http', 'https'], require_protocol: true },
        { message: SERVER_MESSAGES.MEMBERSHIP_URL_NOT_FORM },
    )
    @IsNotEmpty({ message: SERVER_MESSAGES.MEMBERSHIP_URL_EMPTY })
    @ValidateIf((o) => {
        return o.linkType === 'membership';
    })
    membershipUrl: string;

    @ValidateNested({ message: ERROR_MESSAGES.E900 })
    @Type(() => TagsDto)
    tags: TagsDto[];

    @MaxLength(250, { message: SERVER_MESSAGES.SUMMARY_MAX_LENGTH })
    summary: string;

    @MaxLength(8, { message: SERVER_MESSAGES.CONTENT_TYPE_MAX_LENGTH })
    @IsString({ message: SERVER_MESSAGES.CONTENT_TYPE_EMPTY })
    @IsNotEmpty({ message: SERVER_MESSAGES.CONTENT_TYPE_EMPTY })
    contentType: string;

    @Allow()
    content: string;
}
