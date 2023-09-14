// types
import type { SqlOptions } from '@common/types/sql-options.type';
import type { SelectBooleanified } from './global';
// entities
import { Guild } from '@databases/entities/guild.entity';
import { GuildAdminPermission } from '@databases/entities/guild-admin-permission.entity';

// ----------------------------------------------------------------------

/******************************
 * Select
 ******************************/
export interface SelectOptions extends SqlOptions {
    select: {
        // sql: {};
        columns: SelectBooleanified<GuildAdminPermission>;
    };
    where?: Partial<Pick<GuildAdminPermission, 'guild_id' | 'user_id'>>;
}

/******************************
 * FindGuildAdmins
 ******************************/
export interface FindGuildAdminsOptions extends SqlOptions {
    where: Partial<Pick<GuildAdminPermission, 'guild_id' | 'user_id'>> & {
        server_guild_id?: Guild['id'];
    };
}

export interface FindGuildAdmins extends Partial<GuildAdminPermission> {
    where: Partial<Pick<GuildAdminPermission, 'guild_id' | 'user_id'>> & {
        server_guild_id?: Guild['id'];
    };
}

/******************************
 * DML
 ******************************/
export interface InsertOptions extends SqlOptions {
    values: GuildAdminPermission | GuildAdminPermission[];
}
export interface UpdateOptions extends SqlOptions {
    values: Partial<GuildAdminPermission>;
    where: Partial<Pick<GuildAdminPermission, 'guild_id' | 'user_id'>>;
}
export interface DeleteOptions extends SqlOptions {
    where: Partial<Pick<GuildAdminPermission, 'guild_id' | 'user_id'>> & {
        IN?: {
            user_ids?: GuildAdminPermission['guild_id'][];
        };
    };
}
