// lib
import { Injectable } from '@nestjs/common';
// repositories
import { GuildsScheduledRepository } from '@databases/repositories/guilds-scheduled';

// ----------------------------------------------------------------------

@Injectable()
export class GuildsScheduledService {
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
