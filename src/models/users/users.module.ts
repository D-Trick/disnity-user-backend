// lib
import { Module } from '@nestjs/common';
// helpers
import { UtilHelper } from './helper/util.helper';
import { FilterHelper } from './helper/filter.helper';
// modules
import { CacheModule } from '@cache/redis/cache.module';
import { DiscordApiModule } from '@models/discord-api/discordApi.module';
// controllers
import { UsersController } from './users.controller';
// services
import { UsersService } from './users.service';
import { UsersDataService } from './services/data.service';
import { UsersStoreService } from './services/store.service';
import { UsersUpdateService } from './services/update.service';

// ----------------------------------------------------------------------

@Module({
    imports: [CacheModule, DiscordApiModule],
    controllers: [UsersController],
    providers: [UtilHelper, FilterHelper, UsersService, UsersDataService, UsersStoreService, UsersUpdateService],
    exports: [UsersService],
})
export class UsersModule {}
