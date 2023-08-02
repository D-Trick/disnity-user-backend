// lib
import { Module } from '@nestjs/common';
// controllers
import { GuildsScheduledController } from './guilds-scheduled.controller';
// services
import { GuildsScheduledService } from './guilds-scheduled.service';

// ----------------------------------------------------------------------

@Module({
    controllers: [GuildsScheduledController],
    providers: [GuildsScheduledService],
    exports: [GuildsScheduledService],
})
export class GuildsScheduledModule {}
