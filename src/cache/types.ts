// types
import type { UserGuild } from '@models/discord-api/types/discordApi.type';
import type { AdminGuild } from '@models/users/types/users.type';
import type { MenuTree } from '@models/menus/helpers/format-menu-tree';
// entities
import { User } from '@databases/entities/user.entity';

// ----------------------------------------------------------------------
export type CacheUser = Pick<
    User,
    | 'id'
    | 'global_name'
    | 'username'
    | 'discriminator'
    | 'email'
    | 'verified'
    | 'avatar'
    | 'locale'
    | 'created_at'
    | 'updated_at'
>;

export type CacheDiscordUser = CacheUser & {
    guilds: UserGuild[];
    admin_guilds?: AdminGuild[];

    access_token: string;
    refresh_token: string;
};

export type CacheMenus = MenuTree;
