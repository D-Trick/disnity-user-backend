// @nestjs
import { Module } from '@nestjs/common';
// controllers
import { GuildScheduledController } from './guild-scheduled.controller';
// services
import { GuildScheduledService } from './guild-scheduled.service';
import { GuildScheduledDataService } from './services/data.service';

// ----------------------------------------------------------------------

@Module({
    controllers: [GuildScheduledController],
    providers: [GuildScheduledService, GuildScheduledDataService],
    exports: [GuildScheduledService],
})
export class GuildScheduledModule {}
