// @nestjs
import { Injectable } from '@nestjs/common';
// repositories
import { GuildScheduledRepository } from '@databases/repositories/guild-scheduled';

// ----------------------------------------------------------------------

@Injectable()
export class GuildScheduledDataService {
    /**************************************************
     * Constructor
     **************************************************/
    constructor(private readonly guildScheduledRepository: GuildScheduledRepository) {}

    /**************************************************
     * Public Methods
     **************************************************/
    /**
     * 이번달 길드 이벤트 가져오기
     */
    async getThisMonthSchedules() {
        const thisMonthSchedules = await this.guildScheduledRepository.findThisMonthSchedules();

        return thisMonthSchedules;
    }
}
