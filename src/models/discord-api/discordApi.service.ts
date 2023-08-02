// lib
import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
// classes
import { DiscordApiUsers } from './classes/users.class';
import { DiscordApiGuilds } from './classes/guilds.class';
import { DiscordApiInvites } from './classes/invites.class';
import { DiscordApiChannels } from './classes/channels.class';
import { DiscordApiGuildScheduledEvent } from './classes/guild-scheduled-event.class';

// ----------------------------------------------------------------------

@Injectable()
export class DiscordApiService {
    constructor(private readonly axios: HttpService) {}

    /**
     * Discord Users Api 목록
     */
    users(token: string) {
        const users = new DiscordApiUsers(this.axios);

        const apiList = {
            me: users.me(token),
            guilds: users.guilds(token),
        };

        return apiList;
    }

    /**
     * Discord Guilds Api 목록
     */
    guilds() {
        const guilds = new DiscordApiGuilds(this.axios);

        const apiList = {
            detail: async (guildId: string) => guilds.detail(guildId),
            channels: async (guildId: string) => guilds.channels(guildId),
        };

        return apiList;
    }

    /**
     * Discord Guild Scheduled Events Api 목록
     */
    guildScheduledEvents() {
        const guildScheduledEvents = new DiscordApiGuildScheduledEvent(this.axios);

        const apiList = {
            scheduledEvents: async (guildId: string) => guildScheduledEvents.scheduledEvents(guildId),
        };

        return apiList;
    }

    /**
     * Discord Channels Api 목록
     */
    channels() {
        const channels = new DiscordApiChannels(this.axios);

        const apiList = {
            createInvites: async (channelId: string) => channels.createInvites(channelId),
        };

        return apiList;
    }

    /**
     * Discord Invite Api 목록
     */
    invites() {
        const invites = new DiscordApiInvites(this.axios);

        const apiList = {
            detail: async (inviteCode: string) => invites.detail(inviteCode),
        };

        return apiList;
    }
}
