// lib
import { Module } from '@nestjs/common';
// controllers
import { GuildScheduledController } from './guild-scheduled.controller';
// services
import { GuildScheduledService } from './guild-scheduled.service';

// ----------------------------------------------------------------------

@Module({
    controllers: [GuildScheduledController],
    providers: [GuildScheduledService],
    exports: [GuildScheduledService],
})
export class GuildScheduledModule {}
