// types
import type { Select } from '@databases/ts/interfaces/guilds-scheduled.interface';
// lib
import { Injectable } from '@nestjs/common';
// dtos
import { ParamScheduledDateDto } from '@common/dtos';
// repositorys
import { GuildsScheduledRepository } from '@databases/repositories/guilds-scheduled.repository';

// ----------------------------------------------------------------------

@Injectable()
export class GuildsScheduledService {
    constructor(private readonly guildScheduledRepository: GuildsScheduledRepository) {}

    async findByDate(scheduledDate: ParamScheduledDateDto): Promise<Select[]> {
        const promise = this.guildScheduledRepository.selectMany({
            where: {
                scheduled_start_time: scheduledDate.start,
                scheduled_end_time: scheduledDate.end,
            },
        });

        return promise;
    }
}
