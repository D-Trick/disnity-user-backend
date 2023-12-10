// @nestjs
import { Module } from '@nestjs/common';
// modules
import { CoreModule } from '@common/modules/core.module';
// services
import { DiscordApiService } from './discordApi.service';
import { DiscordApiUsersService } from './services/users.service';
import { DiscordApiGuildsService } from './services/guilds.service';
import { DiscordApiChannelsService } from './services/channels.service';
import { DiscordApiInvitesService } from './services/invites.service';
import { DiscordApiGuildScheduledEventService } from './services/guild-scheduled-event.service';

// ----------------------------------------------------------------------

@Module({
    imports: [CoreModule],
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
