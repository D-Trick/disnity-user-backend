// types
import type { User, UserGuild } from '@models/discord-api/ts/interfaces/discordApi.interface';
// lib
import { HttpService } from '@nestjs/axios';
import * as discordApi from '@lib/discord/api';
// configs
import { discordConfig } from '@config/discord.config';

// ----------------------------------------------------------------------
const { AUTH_TYPE_BEARER, API_URL } = discordConfig;
// ----------------------------------------------------------------------

export class DiscordApiUsers {
    /**************************************************
     * Constructor
     **************************************************/
    constructor(private readonly axios: HttpService) {}

    /**************************************************
     * Public Methods
     **************************************************/
    /**
     * 사용자 정보 가져오기
     * @param {string} token
     */
    async me(token: string): Promise<User> {
        const URL = `${API_URL}/users/@me`;

        const { data: user } = await discordApi.get(this.axios, URL, {
            authType: AUTH_TYPE_BEARER,
            token,
        });

        return user;
    }

    /**
     * 현재 사용자 길드 목록 가져오기
     * @param {string} token
     */
    async guilds(token: string): Promise<UserGuild[]> {
        const URL = `${API_URL}/users/@me/guilds`;

        const { data: guilds } = await discordApi.get(this.axios, URL, {
            authType: AUTH_TYPE_BEARER,
            token,
        });

        return guilds;
    }
}
