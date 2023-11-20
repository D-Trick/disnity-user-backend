// lib
import { Injectable } from '@nestjs/common';
// repositories
import { GuildScheduledRepository } from '@databases/repositories/guild-scheduled';

// ----------------------------------------------------------------------

@Injectable()
export class GuildScheduledService {
    /**************************************************
     * Constructor
     **************************************************/
    constructor(private readonly guildScheduledRepository: GuildScheduledRepository) {}

    /**************************************************
     * Public Methods
     **************************************************/
    async getThisMonthSchedules() {
        const thisMonthSchedules = await this.guildScheduledRepository.findThisMonthSchedules();

        return thisMonthSchedules;
    }
}
