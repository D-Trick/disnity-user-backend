// lib
import { Module } from '@nestjs/common';
// modules
import { CoreModule } from '@common/modules/core.module';
import { UsersModule } from '@models/users/users.module';
import { DiscordApiModule } from '@models/discord-api/discordApi.module';
import { ServersPaginationModule } from '@models/pagination/servers/servers-pagination.module';
// controllers
import { ServersController } from './servers.controller';
// services
import { ServersService } from './servers.service';
import { ServersDataService } from './services/data.service';
import { ServersStoreService } from './services/store.service';
import { ServersUpdateService } from './services/update.service';
import { ServersDeleteService } from './services/delete.service';
import { ServersDetailService } from './services/detail.service';

// ----------------------------------------------------------------------

@Module({
    imports: [CoreModule, UsersModule, DiscordApiModule, ServersPaginationModule],
    controllers: [ServersController],
    providers: [
        ServersService,
        ServersDataService,
        ServersStoreService,
        ServersUpdateService,
        ServersDeleteService,
        ServersDetailService,
    ],
    exports: [ServersService],
})
export class ServersModule {}
