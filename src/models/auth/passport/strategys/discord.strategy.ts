// types
import type { AuthDiscordUser } from '@models/auth/types/auth.type';
// lib
import { Injectable } from '@nestjs/common';
// strategys
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from '../OAuth2/discord-strategy';
// configs
import { DISCORD_CONFIG } from '@config/discord.config';
// dtos
import { AuthDiscordUserDto } from '@models/auth/dtos/auth-discord-user.dto';

// ----------------------------------------------------------------------

@Injectable()
export class DiscordStrategy extends PassportStrategy(Strategy, 'discord') {
    constructor() {
        super({
            authorizationURL: DISCORD_CONFIG.URLS.AUTH,
            tokenURL: DISCORD_CONFIG.URLS.TOKEN,
            clientID: DISCORD_CONFIG.APP.CLIENT_ID,
            clientSecret: DISCORD_CONFIG.APP.CLIENT_SECRET,
            callbackURL: DISCORD_CONFIG.CALLBACK_URLS.LOGIN,
            scope: DISCORD_CONFIG.APP.SCOPE,
        });
    }

    validate(accessToken: string, refreshToken: string, profile: any): AuthDiscordUserDto {
        const user: AuthDiscordUser = {
            ...profile,
            access_token: accessToken,
            refresh_token: refreshToken,
        };

        return AuthDiscordUserDto.create(user);
    }
}
