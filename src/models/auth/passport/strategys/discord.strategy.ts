// types
import type { AuthDiscordUser } from '@models/auth/types/auth.type';
// lib
import { Injectable } from '@nestjs/common';
// strategys
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from '../OAuth2/discord-strategy';
// configs
import { discordConfig } from '@config/discord.config';
// dtos
import { AuthDiscordUserDto } from '@models/auth/dtos/auth-discord-user.dto';

// ----------------------------------------------------------------------
const { CLIENT_ID, CLIENT_SECRET, SCOPE, AUTH_URL, TOKEN_URL, LOGIN_REDIRECT_URL } = discordConfig;
// ----------------------------------------------------------------------

@Injectable()
export class DiscordStrategy extends PassportStrategy(Strategy, 'discord') {
    constructor() {
        super({
            authorizationURL: AUTH_URL,
            tokenURL: TOKEN_URL,
            clientID: CLIENT_ID,
            clientSecret: CLIENT_SECRET,
            callbackURL: LOGIN_REDIRECT_URL,
            scope: SCOPE,
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
