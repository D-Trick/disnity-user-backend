// types
import type { Invite } from '../types/discordApi.type';
// lib
import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import * as discordApi from 'src/utils/discord/api';
// configs
import { discordConfig } from '@config/discord.config';

// ----------------------------------------------------------------------
const { API_URL, AUTH_TYPE_BOT, BOT_TOKEN } = discordConfig;
// ----------------------------------------------------------------------

@Injectable()
export class DiscordApiChannels {
    /**************************************************
     * Constructor
     **************************************************/
    constructor(private axios: HttpService) {}

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
        const { data: invites } = await discordApi.post(this.axios, URL, body, {
            authType: AUTH_TYPE_BOT,
            token: BOT_TOKEN,
        });

        return invites;
    }
}
