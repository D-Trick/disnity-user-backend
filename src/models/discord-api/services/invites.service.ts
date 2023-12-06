// types
import type { Invite } from '../types/discordApi.type';
// @nestjs
import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
// lib
import * as discordApi from '@utils/discord/api';
// configs
import { discordConfig } from '@config/discord.config';

// ----------------------------------------------------------------------
const { API_URL } = discordConfig;
// ----------------------------------------------------------------------

@Injectable()
export class DiscordApiInvitesService {
    /**************************************************
     * Constructor
     **************************************************/
    constructor(private axios: HttpService) {}

    /**************************************************
     * Public Methods
     **************************************************/
    /**
     * 초대코드 가져오기
     * @param {string} guildId
     */
    async detail(inviteCode: string): Promise<Invite> {
        const URL = `${API_URL}/invites/${inviteCode}`;

        const { data: invite } = await discordApi.get(this.axios, URL, {
            authType: null,
            token: null,
        });

        return invite;
    }
}
