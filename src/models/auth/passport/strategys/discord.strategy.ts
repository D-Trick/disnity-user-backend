// lib
import { Injectable } from '@nestjs/common';
// strategys
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from '../OAuth2/discord-strategy';
// configs
import { discordConfig } from '@config/discord.config';

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

    async validate(accessToken: string, refreshToken: string, profile: any): Promise<any> {
        return {
            ...profile,
            access_token: accessToken,
            refresh_token: refreshToken,
        };
    }
}
