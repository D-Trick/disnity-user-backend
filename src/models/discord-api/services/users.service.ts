// types
import type { User, UserGuild } from '@models/discord-api/types/discord-api.type';
// @nestjs
import { Injectable } from '@nestjs/common';
// utils
import { DiscordApi } from '@utils/discord/api';
// configs
import { DISCORD_CONFIG } from '@config/discord.config';

// ----------------------------------------------------------------------

@Injectable()
export class DiscordApiUsersService {
    /**************************************************
     * Public Methods
     **************************************************/
    /**
     * 유저 정보 가져오기
     * @param {string} token
     */
    async me(token: string): Promise<User> {
        const URL = `${DISCORD_CONFIG.URLS.API}/users/@me`;

        const { data: user } = await DiscordApi.get(URL, {
            authType: DISCORD_CONFIG.APP.AUTH_TYPE,
            token,
        });

        return user;
    }

    /**
     * 유저가 속한 길드 목록 가져오기
     * @param {string} token
     */
    async guilds(token: string): Promise<UserGuild[]> {
        const URL = `${DISCORD_CONFIG.URLS.API}/users/@me/guilds`;

        const { data: guilds } = await DiscordApi.get(URL, {
            authType: DISCORD_CONFIG.APP.AUTH_TYPE,
            token,
        });

        return guilds;
    }
}
