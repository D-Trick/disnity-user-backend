// @nestjs
import { Module } from '@nestjs/common';

import { CacheModule } from '@nestjs/cache-manager';
// configs
import { REDIS_CONFIG } from '@config/redis.config';

// global modules
import { RouterModule } from '@routers/router.module';
import { DatabaseModule } from '@common/modules/database.module';
// model modules
import { AuthModule } from '@models/auth/auth.module';
import { TagsModule } from '@models/tags/tags.module';
import { MenusModule } from '@models/menus/menus.module';
import { UsersModule } from '@models/users/users.module';
import { MypageModule } from '@models/mypage/mypage.module';
import { SearchModule } from '@models/search/search.module';
import { SitemapModule } from '@models/sitemap/sitemap.module';
import { ServersModule } from '@models/servers/servers.module';
import { RedirectModule } from '@models/redirect/redirect.module';
import { CommonCodeModule } from '@models/common-code/common-code.module';
import { GuildScheduledModule } from '@models/guild-scheduled/guild-scheduled.module';

// ----------------------------------------------------------------------

@Module({
    imports: [
        RouterModule,
        CacheModule.registerAsync(REDIS_CONFIG),

        // Global
        DatabaseModule,

        // Model
        AuthModule,
        TagsModule,
        UsersModule,
        MenusModule,
        SearchModule,
        MypageModule,
        SitemapModule,
        ServersModule,
        RedirectModule,
        CommonCodeModule,
        GuildScheduledModule,
    ],
})
export class AppModule {}
