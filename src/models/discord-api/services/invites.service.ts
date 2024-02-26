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
export class DiscordApiInvitesService {
    /**************************************************
     * Public Methods
     **************************************************/
    /**
     * 초대코드 가져오기
     * @param {string} guildId
     */
    async detail(inviteCode: string): Promise<Invite> {
        const URL = `${DISCORD_CONFIG.URLS.API}/invites/${inviteCode}`;

        const { data: invite } = await DiscordApi.get(URL, {
            authType: null,
            token: null,
        });

        return invite;
    }
}
