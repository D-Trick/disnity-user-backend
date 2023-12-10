// lib
import { Module } from '@nestjs/common';
// helpers
import { PaginationHelper } from './helpers/pagination.helper';
// modules
import { CoreModule } from '@common/modules/core.module';
import { UsersModule } from '@models/users/users.module';
import { DiscordApiModule } from '@models/discord-api/discordApi.module';
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
    imports: [CoreModule, UsersModule, DiscordApiModule],
    controllers: [ServersController],
    providers: [
        ServersService,
        ServersDataService,
        ServersStoreService,
        ServersUpdateService,
        ServersDeleteService,
        ServersDetailService,
        PaginationHelper,
    ],
    exports: [ServersService],
})
export class ServersModule {}
