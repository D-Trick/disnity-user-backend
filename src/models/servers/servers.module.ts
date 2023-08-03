// lib
import { Module } from '@nestjs/common';
// modules
import { CoreModule } from '@common/modules/core.module';
import { UsersModule } from '@models/users/users.module';
import { DiscordApiModule } from '@models/discord-api/discordApi.module';
// controllers
import { ServersController } from './servers.controller';
// services
import { ServersService } from './servers.service';
// helpers
import { PaginationHelper } from './helpers/pagination.helper';

// ----------------------------------------------------------------------

@Module({
    imports: [CoreModule, UsersModule, DiscordApiModule],
    controllers: [ServersController],
    providers: [ServersService, PaginationHelper],
    exports: [ServersService],
})
export class ServersModule {}