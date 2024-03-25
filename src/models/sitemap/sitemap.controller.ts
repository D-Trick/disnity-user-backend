// @nestjs
import { Controller, Get } from '@nestjs/common';
// utils
import { ControllerException } from '@utils/response';
// dtos
import { DisnitySitemapResponseDto } from './dtos/disnity-sitemap-response.dto';
// services
import { SitemapListService } from './services/list.service';

// ----------------------------------------------------------------------

@Controller()
export class SitemapController {
    /**************************************************
     * Constructor
     **************************************************/
    constructor(private sitemapListService: SitemapListService) {}

    /**************************************************
     * Public Methods
     **************************************************/
    @Get('/disnity')
    async disnitySitemap() {
        try {
            const staticUrls = this.sitemapListService.getStaticUrls();
            const dynamicUrls = await this.sitemapListService.getDynamicUrls();

            return new DisnitySitemapResponseDto(staticUrls, dynamicUrls);
        } catch (error: any) {
            throw new ControllerException(error);
        }
    }
}
