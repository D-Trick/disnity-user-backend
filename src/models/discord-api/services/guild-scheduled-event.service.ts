// types
import type { GuildScheduledEvent } from '../types/discord-api.type';
// @nestjs
import { Injectable } from '@nestjs/common';
// utils
import { DiscordApi } from '@utils/discord/api';
// configs
import { DISCORD_CONFIG } from '@config/discord.config';

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
        const URL = `${DISCORD_CONFIG.URLS.API}/guilds/${guildId}/scheduled-events`;

        const { data: guildSchedules } = await DiscordApi.get(URL, {
            authType: DISCORD_CONFIG.BOT.AUTH_TYPE,
            token: DISCORD_CONFIG.BOT.TOKEN,
        });

        return guildSchedules;
    }
}
