// lib
import { Module } from '@nestjs/common';
// helpers
import { UtilHelper } from './helper/util.helper';
import { FilterHelper } from './helper/filter.helper';
// modules
import { CacheModule } from '@cache/cache.module';
import { DiscordApiModule } from '@models/discord-api/discord-api.module';
// controllers
import { UsersController } from './users.controller';
// services
import { UsersListService } from './services/list.service';
import { UsersStoreService } from './services/store.service';
import { UsersUpdateService } from './services/update.service';

// ----------------------------------------------------------------------

@Module({
    imports: [CacheModule, DiscordApiModule],
    controllers: [UsersController],
    providers: [UtilHelper, FilterHelper, UsersListService, UsersStoreService, UsersUpdateService],
    exports: [UsersListService, UsersStoreService, UsersUpdateService],
})
export class UsersModule {}
