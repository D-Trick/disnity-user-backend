// lib
import { Controller, Get } from '@nestjs/common';
// services
import { GuildsScheduledService } from '@models/guilds-scheduled/guilds-scheduled.service';

// ----------------------------------------------------------------------

@Controller()
export class GuildsScheduledController {
    /**************************************************
     * Constructor
     **************************************************/
    constructor(private readonly guildScheduledService: GuildsScheduledService) {}

    /**************************************************
     * Public Methods
     **************************************************/
    @Get()
    async index() {
        const schedules = await this.guildScheduledService.getThisMonthScheduled();

        return schedules;
    }
}
