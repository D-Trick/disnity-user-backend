// @nestjs
import { Controller, Get } from '@nestjs/common';
// utils
import { controllerThrow } from '@utils/response/controller-throw';
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
    async thisMonthSchedules() {
        try {
            const thisMonthSchedules = await this.guildScheduledService.getThisMonthSchedules();

            return thisMonthSchedules;
        } catch (error: any) {
            controllerThrow(error);
        }
    }
}
