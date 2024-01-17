// types
import type { GuildScheduledEvent } from '../types/discordApi.type';
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
export class DiscordApiGuildScheduledEventService {
    /**************************************************
     * Public Methods
     **************************************************/
    /**
     * 길드 일정 이벤트 목록
     * @param {string} guildId
     */
    async scheduledEvents(guildId: string): Promise<GuildScheduledEvent[]> {
        const URL = `${API_URL}/guilds/${guildId}/scheduled-events`;

        const { data: guildSchedules } = await DiscordApi.get(URL, {
            authType: AUTH_TYPE_BOT,
            token: BOT_TOKEN,
        });

        return guildSchedules;
    }
}
