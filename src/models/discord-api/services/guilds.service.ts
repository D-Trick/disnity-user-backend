// types
import type { Guild, Channel } from '../types/discord-api.type';
// @nestjs
import { Injectable } from '@nestjs/common';
// utils
import { DiscordApi } from '@utils/discord/api';
// configs
import { DISCORD_CONFIG } from '@config/discord.config';

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
        const URL = `${DISCORD_CONFIG.URLS.API}/guilds/${guildId}?with_counts=true`;

        const { data: guild } = await DiscordApi.get(URL, {
            authType: DISCORD_CONFIG.BOT.AUTH_TYPE,
            token: DISCORD_CONFIG.BOT.TOKEN,
        });

        return guild;
    }

    /**
     * 길드 채널 목록
     * @param {string} guildId
     */
    async channels(guildId: string): Promise<Channel[]> {
        const URL = `${DISCORD_CONFIG.URLS.API}/guilds/${guildId}/channels`;

        const { data: guilds } = await DiscordApi.get(URL, {
            authType: DISCORD_CONFIG.BOT.AUTH_TYPE,
            token: DISCORD_CONFIG.BOT.TOKEN,
        });

        return guilds;
    }
}
