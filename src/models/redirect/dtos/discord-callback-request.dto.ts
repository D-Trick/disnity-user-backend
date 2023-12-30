// lib
import { Allow, IsOptional, MaxLength } from 'class-validator';
// messages
import { HTTP_ERROR_MESSAGES } from '@common/messages';

// ----------------------------------------------------------------------

export class DiscordCallbackRequestDto {
    @MaxLength(10, { message: HTTP_ERROR_MESSAGES['900'] })
    @IsOptional()
    redirect?: string;

    @MaxLength(20, { message: HTTP_ERROR_MESSAGES['900'] })
    @IsOptional()
    guild_id?: string;

    @Allow()
    code?: string;

    @Allow()
    permissions?: string;

    @MaxLength(100, { message: HTTP_ERROR_MESSAGES['900'] })
    @IsOptional()
    error?: string;

    @Allow()
    error_description?: string;
}
