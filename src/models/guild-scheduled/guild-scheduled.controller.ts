// lib
import { Controller, Get } from '@nestjs/common';
// services
import { GuildScheduledService } from '@models/guild-scheduled/guild-scheduled.service';

// ----------------------------------------------------------------------

@Controller()
export class GuildScheduledController {
    /**************************************************
     * Constructor
     **************************************************/
    constructor(private readonly guildScheduledService: GuildScheduledService) {}

    /**************************************************
     * Public Methods
     **************************************************/
    @Get()
    async index() {
        const schedules = await this.guildScheduledService.getThisMonthScheduled();

        return schedules;
    }
}
