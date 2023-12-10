// types
import type { SqlOptions } from '@common/types/sql-options.type';
import type { SelectBooleanified } from './global';
// entities
import { User } from '@databases/entities/user.entity';
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
    where: Partial<Pick<GuildAdminPermission, 'guild_id' | 'user_id'>>;
}

export type FindGuildAdmins = Pick<GuildAdminPermission, 'is_owner'> &
    Pick<User, 'id' | 'global_name' | 'username' | 'avatar' | 'discriminator'>;

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
