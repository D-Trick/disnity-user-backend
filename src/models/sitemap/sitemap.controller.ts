// @nestjs
import { Controller, Get } from '@nestjs/common';
// utils
import { ControllerException } from '@utils/response';
// dtos
import { DynamicUrlsResponseDto } from './dtos/dynamic-urls-response.dto';
// services
import { SitemapService } from './sitemap.service';

// ----------------------------------------------------------------------

@Controller()
export class SitemapController {
    /**************************************************
     * Constructor
     **************************************************/
    constructor(private sitemapService: SitemapService) {}

    /**************************************************
     * Public Methods
     **************************************************/
    @Get('/disnity')
    async dynamicUrl() {
        try {
            const dynamicData = await this.sitemapService.getDynamicData();

            return new DynamicUrlsResponseDto(dynamicData).urls;
        } catch (error: any) {
            throw new ControllerException(error);
        }
    }
}
