// types
import type { ReturnSelect } from '@databases/types/user.type';
import type { UserGuild } from '@models/discord-api/types/discordApi.type';
import type { AdminGuild } from '@models/users/types/users.type';
import type { MenuTree } from '@models/menus/helpers/format-menu-tree';

// ----------------------------------------------------------------------
export type CacheUser = ReturnSelect['base'];

export type CacheDiscordUser = ReturnSelect['base'] & {
    guilds: UserGuild[];
    admin_guilds?: AdminGuild[];

    access_token: string;
    refresh_token: string;
};

export type CacheMenus = MenuTree;
