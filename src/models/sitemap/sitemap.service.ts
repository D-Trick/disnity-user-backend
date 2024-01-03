// @nestjs
import { Injectable } from '@nestjs/common';
// services
import { SitemapDataService } from './services/data.service';

// ----------------------------------------------------------------------

@Injectable()
export class SitemapService {
    /**************************************************
     * Constructor
     **************************************************/
    constructor(private readonly dataService: SitemapDataService) {}

    /**************************************************
     * Public Methods
     **************************************************/
    /******************************
     * dataService
     ******************************/
    /**
     * 동적 Url 가져오기
     */
    async getDynamicData() {
        return await this.dataService.getDynamicData();
    }
}
