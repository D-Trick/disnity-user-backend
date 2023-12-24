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
} from 'class-validator';
import { Type } from 'class-transformer';
// messages
import { SERVER_ERROR_MESSAGES, HTTP_ERROR_MESSAGES } from '@common/messages';
// dtos
import { TagsDto } from './tags.dto';

// ----------------------------------------------------------------------

export class UpdateDto {
    @IsIn(['public', 'private'], { message: SERVER_ERROR_MESSAGES.BAD_SERVER_OPEN })
    serverOpen: 'public' | 'private';

    @Max(65535, { message: SERVER_ERROR_MESSAGES.CATEGORY_NOT_FOUND })
    @Min(1, { message: SERVER_ERROR_MESSAGES.CATEGORY_NOT_FOUND })
    categoryId: number;

    @IsIn(['invite', 'membership'], { message: SERVER_ERROR_MESSAGES.BAD_LINK_TYPE })
    linkType: 'invite' | 'membership';

    @IsIn(['auto', 'manual'], { message: SERVER_ERROR_MESSAGES.BAD_INVITE_AUTO })
    inviteAuto: 'auto' | 'manual';

    @MaxLength(15, { message: SERVER_ERROR_MESSAGES.INVITE_MAX_LENGTH })
    @IsString({ message: SERVER_ERROR_MESSAGES.INVITE_EMPTY })
    @IsNotEmpty({ message: SERVER_ERROR_MESSAGES.INVITE_EMPTY })
    @ValidateIf((o) => {
        return o.linkType === 'invite' && o.inviteAuto === 'manual';
    })
    inviteCode: string;

    @MaxLength(22, { message: SERVER_ERROR_MESSAGES.CHANNEL_NOT_FOUND })
    @IsNumberString({ no_symbols: true }, { message: SERVER_ERROR_MESSAGES.CHANNEL_NOT_FOUND })
    @ValidateIf((o) => {
        return o.linkType === 'invite' && o.inviteAuto === 'auto';
    })
    channelId: string;

    @IsUrl(
        { protocols: ['http', 'https'], require_protocol: true },
        { message: SERVER_ERROR_MESSAGES.INVALID_MEMBERSHIP_URL_FORMAT },
    )
    @IsNotEmpty({ message: SERVER_ERROR_MESSAGES.MEMBERSHIP_URL_EMPTY })
    @ValidateIf((o) => {
        return o.linkType === 'membership';
    })
    membershipUrl: string;

    @ValidateNested({ message: HTTP_ERROR_MESSAGES['900'] })
    @Type(() => TagsDto)
    tags: TagsDto[];

    @MaxLength(250, { message: SERVER_ERROR_MESSAGES.SUMMARY_MAX_LENGTH })
    summary: string;

    @IsIn(['basic', 'markdown'], { message: SERVER_ERROR_MESSAGES.BAD_INVITE_AUTO })
    contentType: 'basic' | 'markdown';

    @Allow()
    content: string;
}
