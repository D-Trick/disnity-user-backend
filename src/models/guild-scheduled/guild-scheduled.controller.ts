// @nestjs
import { Controller, Get } from '@nestjs/common';
// utils
import { controllerThrow } from '@utils/response/controller-throw';
// dtos
import { ThisMonthScheduleListResponseDto } from './dtos';
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

            return thisMonthSchedules.map((schedule) => new ThisMonthScheduleListResponseDto(schedule));
        } catch (error: any) {
            controllerThrow(error);
        }
    }
}
