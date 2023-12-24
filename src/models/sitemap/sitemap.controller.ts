// @nestjs
import { Controller, Get } from '@nestjs/common';
// utils
import { controllerThrow } from '@utils/response/controller-throw';
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
            const dynamicUrls = await this.sitemapService.getDynamicUrl();

            return dynamicUrls;
        } catch (error: any) {
            controllerThrow(error);
        }
    }
}
