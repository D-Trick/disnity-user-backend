// @nestjs
import { Injectable } from '@nestjs/common';
// repositories
import { GuildScheduledDataService } from './services/data.service';

// ----------------------------------------------------------------------

@Injectable()
export class GuildScheduledService {
    /**************************************************
     * Constructor
     **************************************************/
    constructor(private readonly dataService: GuildScheduledDataService) {}

    /**************************************************
     * Public Methods
     **************************************************/
    /******************************
     * dataService
     ******************************/
    /**
     * 이번달 길드 이벤트 목록 가져오기
     */
    async getThisMonthSchedules() {
        return await this.dataService.getThisMonthSchedules();
    }
}
