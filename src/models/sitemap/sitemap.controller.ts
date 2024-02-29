// @nestjs
import { Controller, Get } from '@nestjs/common';
// utils
import { ControllerException } from '@utils/response';
// dtos
import { DisnitySitemapResponseDto } from './dtos/disnity-sitemap-response.dto';
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
    async disnitySitemap() {
        try {
            const staticUrls = this.sitemapService.getStaticUrls();
            const dynamicUrls = await this.sitemapService.getDynamicUrls();

            return new DisnitySitemapResponseDto(staticUrls, dynamicUrls);
        } catch (error: any) {
            throw new ControllerException(error);
        }
    }
}
