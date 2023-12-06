// @nestjs
import { Injectable } from '@nestjs/common';
// services
import { DiscordApiUsersService } from './services/users.service';
import { DiscordApiGuildsService } from './services/guilds.service';
import { DiscordApiInvitesService } from './services/invites.service';
import { DiscordApiChannelsService } from './services/channels.service';
import { DiscordApiGuildScheduledEventService } from './services/guild-scheduled-event.service';

// ----------------------------------------------------------------------

@Injectable()
export class DiscordApiService {
    /**************************************************
     * Constructor
     **************************************************/
    constructor(
        private readonly usersService: DiscordApiUsersService,
        private readonly guildsService: DiscordApiGuildsService,
        private readonly invitesService: DiscordApiInvitesService,
        private readonly channelsService: DiscordApiChannelsService,
        private readonly scheduledEventService: DiscordApiGuildScheduledEventService,
    ) {}

    /**************************************************
     * Public Methods
     **************************************************/
    /******************************
     * usersService
     ******************************/
    /**
     * Discord Users Api 목록
     */
    users() {
        return this.usersService;
    }

    /******************************
     * guildsService
     ******************************/
    /**
     * Discord Guilds Api 목록
     */
    guilds() {
        return this.guildsService;
    }

    /******************************
     * scheduledEventService
     ******************************/
    /**
     * Discord Guild Scheduled Events Api 목록
     */
    guildScheduledEvents() {
        return this.scheduledEventService;
    }

    /******************************
     * channelsService
     ******************************/
    /**
     * Discord Channels Api 목록
     */
    channels() {
        return this.channelsService;
    }

    /******************************
     * invitesService
     ******************************/
    /**
     * Discord Invite Api 목록
     */
    invites() {
        return this.invitesService;
    }
}
