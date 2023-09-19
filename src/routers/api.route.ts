// modules
import { TagsModule } from '@models/tags/tags.module';
import { MenusModule } from '@models/menus/menus.module';
import { UsersModule } from '@models/users/users.module';
import { MypageModule } from '@models/mypage/mypage.module';
import { SearchModule } from '@models/search/search.module';
import { CommonCodeModule } from '@models/common-code/common-code.module';
import { ServersModule } from '@models/servers/servers.module';
import { SitemapModule } from '@models/sitemap/sitemap.module';
import { GuildScheduledModule } from '@models/guild-scheduled/guild-scheduled.module';

// ----------------------------------------------------------------------

const apiRouter = {
    path: 'api',
    children: [
        {
            path: 'menus',
            module: MenusModule,
        },
        {
            path: 'common-code',
            module: CommonCodeModule,
        },
        {
            path: 'users',
            module: UsersModule,
        },
        {
            path: 'servers',
            module: ServersModule,
        },
        {
            path: 'guild-scheduled',
            module: GuildScheduledModule,
        },
        {
            path: 'search',
            module: SearchModule,
        },
        {
            path: 'tags',
            module: TagsModule,
        },
        {
            path: 'mypage',
            module: MypageModule,
        },
        {
            path: 'sitemap',
            module: SitemapModule,
        },
    ],
};

export default apiRouter;
