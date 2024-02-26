// types
import type { Invite } from '../types/discordApi.type';
// @nestjs
import { Injectable } from '@nestjs/common';
// utils
import { DiscordApi } from '@utils/discord/api';
// configs
import { DISCORD_CONFIG } from '@config/discord.config';

// ----------------------------------------------------------------------

@Injectable()
export class DiscordApiChannelsService {
    /**************************************************
     * Public Methods
     **************************************************/
    /**
     * 채널 초대코드 생성
     * @param {string} channelId
     */
    async createInvites(channelId: string): Promise<Invite> {
        const URL = `${DISCORD_CONFIG.URLS.API}/channels/${channelId}/invites`;

        const body = {
            max_age: 0,
        };
        const { data: invites } = await DiscordApi.post(URL, body, {
            authType: DISCORD_CONFIG.BOT.AUTH_TYPE,
            token: DISCORD_CONFIG.BOT.TOKEN,
        });

        return invites;
    }
}
