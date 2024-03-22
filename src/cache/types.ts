// types
import type { UserGuild, User as DiscordUser } from '@models/discord-api/types/discord-api.type';
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

export interface CacheGuildAdmin {
    is_owner: boolean;
    id: DiscordUser['id'];
    bot: boolean;
    system: boolean;
    flags: DiscordUser['flags'];
    username: DiscordUser['username'];
    globalName: DiscordUser['global_name'];
    discriminator: DiscordUser['discriminator'];
    avatar: DiscordUser['avatar'];
    avatarDecoration: DiscordUser['avatar_decoration_data'];
}

export type CacheMenus = MenuTree;
