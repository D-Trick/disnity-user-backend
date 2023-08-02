// types
import type { SqlOptions } from '@common/ts/interfaces/sql-options.interface';
// entities
import { ServerAdminPermission } from '@databases/entities/server-admin-permission.entity';

// ----------------------------------------------------------------------

/******************************
 * FindDetail
 ******************************/
export interface FindDetail extends SqlOptions {
    where: {
        guild_id?: string;
        user_id?: string;
        server_guild_id?: string;
    };
}

/******************************
 * Select
 ******************************/
export interface SelectOptions extends SqlOptions {
    where?: {
        guild_id?: string;
        user_id?: string;
    };
}

/******************************
 * DML
 ******************************/
export interface InsertOptions extends SqlOptions {
    values: ServerAdminPermission | ServerAdminPermission[];
}
export interface UpdateOptions extends SqlOptions {
    values: Partial<ServerAdminPermission>;
    where: {
        guild_id: string;
        user_id: string;
    };
}
export interface DeleteOptions extends SqlOptions {
    where: {
        IN?: {
            user_ids?: string[];
        };
        guild_id: string;
        user_id?: string;
    };
}
