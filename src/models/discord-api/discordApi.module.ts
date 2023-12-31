// @nestjs
import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
// services
import { DiscordApiService } from './discordApi.service';
import { DiscordApiUsersService } from './services/users.service';
import { DiscordApiGuildsService } from './services/guilds.service';
import { DiscordApiChannelsService } from './services/channels.service';
import { DiscordApiInvitesService } from './services/invites.service';
import { DiscordApiGuildScheduledEventService } from './services/guild-scheduled-event.service';

// ----------------------------------------------------------------------

@Module({
    imports: [HttpModule],
    providers: [
        DiscordApiService,
        DiscordApiUsersService,
        DiscordApiGuildsService,
        DiscordApiInvitesService,
        DiscordApiChannelsService,
        DiscordApiGuildScheduledEventService,
    ],
    exports: [DiscordApiService],
})
export class DiscordApiModule {}
