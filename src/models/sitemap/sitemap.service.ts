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
    async getDynamicUrl() {
        return await this.dataService.getDynamicUrl();
    }

    /**************************************************
     * Private Methods
     **************************************************/
    private urlJsonArrayToArray(urlJsonArray: { url: string }[]) {
        const urlArray = [];

        const { length = 0 } = urlJsonArray;
        for (let i = 0; i < length; i++) {
            const json = urlJsonArray[i];

            urlArray.push(json.url);
        }

        return urlArray;
    }
}
