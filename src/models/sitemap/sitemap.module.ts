// @nestjs
import { Module } from '@nestjs/common';
// controllers
import { SitemapController } from './sitemap.controller';
// services
import { SitemapListService } from './services/list.service';

// ----------------------------------------------------------------------

@Module({
    controllers: [SitemapController],
    providers: [SitemapListService],
    exports: [SitemapListService],
})
export class SitemapModule {}
