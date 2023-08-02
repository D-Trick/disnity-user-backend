// lib
import { Param, Controller, Get } from '@nestjs/common';
// dtos
import { ParamScheduledDateDto } from '@common/dtos';
// services
import { GuildsScheduledService } from '@models/guilds-scheduled/guilds-scheduled.service';

// ----------------------------------------------------------------------

@Controller()
export class GuildsScheduledController {
    constructor(private readonly guildScheduledService: GuildsScheduledService) {}

    @Get(':start/:end')
    async scheduledDateSearch(@Param() param: ParamScheduledDateDto) {
        const schedules = await this.guildScheduledService.findByDate(param);

        return schedules;
    }
}
