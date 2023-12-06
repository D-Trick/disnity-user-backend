// types
import type { User, UserGuild } from '@models/discord-api/types/discordApi.type';
// @nestjs
import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
// lib
import * as discordApi from '@utils/discord/api';
// configs
import { discordConfig } from '@config/discord.config';

// ----------------------------------------------------------------------
const { AUTH_TYPE_BEARER, API_URL } = discordConfig;
// ----------------------------------------------------------------------

@Injectable()
export class DiscordApiUsersService {
    /**************************************************
     * Constructor
     **************************************************/
    constructor(private readonly axios: HttpService) {}

    /**************************************************
     * Public Methods
     **************************************************/
    /**
     * 유저 정보 가져오기
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
     * 유저가 속한 길드 목록 가져오기
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
