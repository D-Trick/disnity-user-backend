// @nestjs
import { Module } from '@nestjs/common';
// controllers
import { SitemapController } from './sitemap.controller';
// services
import { SitemapService } from './sitemap.service';
import { SitemapDataService } from './services/data.service';

// ----------------------------------------------------------------------

@Module({
    controllers: [SitemapController],
    providers: [SitemapService, SitemapDataService],
    exports: [SitemapService],
})
export class SitemapModule {}
