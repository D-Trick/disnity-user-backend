// @nestjs
import { Controller, Get } from '@nestjs/common';
// utils
import { ControllerException } from '@utils/response';
// dtos
import { ThisMonthScheduleListResponseDto } from './dtos';
// services
import { GuildScheduledListService } from '@models/guild-scheduled/services/list.service';

// ----------------------------------------------------------------------

@Controller()
export class GuildScheduledController {
    /**************************************************
     * Constructor
     **************************************************/
    constructor(private readonly guildScheduledListService: GuildScheduledListService) {}

    /**************************************************
     * Public Methods
     **************************************************/
    @Get()
    async thisMonthSchedules() {
        try {
            const thisMonthSchedules = await this.guildScheduledListService.getThisMonthSchedules();

            return thisMonthSchedules.map((schedule) => new ThisMonthScheduleListResponseDto(schedule));
        } catch (error: any) {
            throw new ControllerException(error);
        }
    }
}
