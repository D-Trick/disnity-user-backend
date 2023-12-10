// @nestjs
import { Module } from '@nestjs/common';
// modules
import { CoreModule } from '@common/modules/core.module';
// controllers
import { SitemapController } from './sitemap.controller';
// services
import { SitemapService } from './sitemap.service';
import { SitemapDataService } from './services/data.service';

// ----------------------------------------------------------------------

@Module({
    imports: [CoreModule],
    controllers: [SitemapController],
    providers: [SitemapService, SitemapDataService],
    exports: [SitemapService],
})
export class SitemapModule {}
