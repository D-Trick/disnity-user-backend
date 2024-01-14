// types
import type { Invite } from '../types/discordApi.type';
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
export class DiscordApiChannelsService {
    /**************************************************
     * Public Methods
     **************************************************/
    /**
     * 채널 초대코드 생성
     * @param {string} channelId
     */
    async createInvites(channelId: string): Promise<Invite> {
        const URL = `${API_URL}/channels/${channelId}/invites`;

        const body = {
            max_age: 0,
        };
        const { data: invites } = await DiscordApi.post(URL, body, {
            authType: AUTH_TYPE_BOT,
            token: BOT_TOKEN,
        });

        return invites;
    }
}
