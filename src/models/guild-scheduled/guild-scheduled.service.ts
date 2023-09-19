// lib
import { Injectable } from '@nestjs/common';
// repositories
import { GuildsScheduledRepository } from '@databases/repositories/guild-scheduled';

// ----------------------------------------------------------------------

@Injectable()
export class GuildScheduledService {
    /**************************************************
     * Constructor
     **************************************************/
    constructor(private readonly guildScheduledRepository: GuildsScheduledRepository) {}

    /**************************************************
     * Public Methods
     **************************************************/
    async getThisMonthScheduled() {
        return this.guildScheduledRepository.findThisMonthScheduled();
    }
}
