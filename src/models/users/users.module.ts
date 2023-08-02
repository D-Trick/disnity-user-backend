// lib
import { Module } from '@nestjs/common';
// helpers
import { UtilHelper } from './helper/util.helper';
import { FilterHelper } from './helper/filter.helper';
// modules
import { CoreModule } from '@common/modules/core.module';
import { DiscordApiModule } from '@models/discord-api/discordApi.module';
// controllers
import { UsersController } from './users.controller';
// services
import { UsersService } from './users.service';

// ----------------------------------------------------------------------

@Module({
    imports: [CoreModule, DiscordApiModule],
    controllers: [UsersController],
    providers: [UsersService, UtilHelper, FilterHelper],
    exports: [UsersService],
})
export class UsersModule {}
