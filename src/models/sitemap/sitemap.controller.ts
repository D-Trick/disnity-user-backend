// lib
import { Controller, Get } from '@nestjs/common';
// services
import { SitemapService } from './sitemap.service';

// ----------------------------------------------------------------------

@Controller()
export class SitemapController {
    constructor(private sitemapService: SitemapService) {}

    @Get('/disnity')
    async sitemap(): Promise<string[]> {
        const dynamicUrls = await this.sitemapService.getDynamicUrl();

        return dynamicUrls;
    }
}
