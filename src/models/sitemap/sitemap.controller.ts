// lib
import { Controller, Get } from '@nestjs/common';
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
    async disnity(): Promise<string[]> {
        const dynamicUrls = await this.sitemapService.getDynamicUrl();

        return dynamicUrls;
    }
}
