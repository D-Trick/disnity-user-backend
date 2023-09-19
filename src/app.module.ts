// @nestjs
import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheModule } from '@nestjs/cache-manager';
// configs
import { cacheConfig } from '@config/redis.config';
import { mysqlConfig } from '@config/database.config';
// routes
import router from '@routers/index';
// global modules
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
        RouterModule.register(router),
        TypeOrmModule.forRoot(mysqlConfig),
        CacheModule.registerAsync(cacheConfig),

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
