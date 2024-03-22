// @nestjs
import { Module } from '@nestjs/common';
// controllers
import { GuildScheduledController } from './guild-scheduled.controller';
// services
import { GuildScheduledListService } from './services/list.service';

// ----------------------------------------------------------------------

@Module({
    controllers: [GuildScheduledController],
    providers: [GuildScheduledListService],
    exports: [GuildScheduledListService],
})
export class GuildScheduledModule {}
