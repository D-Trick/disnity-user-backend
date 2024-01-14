// types
import type { Guild, Channel } from '../types/discordApi.type';
// @nestjs
import { Injectable } from '@nestjs/common';
// utils
import { DiscordApi } from '@utils/discord/api';
// configs
import { discordConfig } from '@config/discord.config';

// ----------------------------------------------------------------------
const { API_URL, AUTH_TYPE_BOT, BOT_TOKEN } = discordConfig;
// ----------------------------------------------------------------------

@Injectable()
export class DiscordApiGuildsService {
    /**************************************************
     * Public Methods
     **************************************************/
    /**
     * 길드 상세 정보
     * @param {string} guildId
     */
    async detail(guildId: string): Promise<Guild> {
        const URL = `${API_URL}/guilds/${guildId}?with_counts=true`;

        const { data: guild } = await DiscordApi.get(URL, {
            authType: AUTH_TYPE_BOT,
            token: BOT_TOKEN,
        });

        return guild;
    }

    /**
     * 길드 채널 목록
     * @param {string} guildId
     */
    async channels(guildId: string): Promise<Channel[]> {
        const URL = `${API_URL}/guilds/${guildId}/channels`;

        const { data: guilds } = await DiscordApi.get(URL, {
            authType: AUTH_TYPE_BOT,
            token: BOT_TOKEN,
        });

        return guilds;
    }
}
