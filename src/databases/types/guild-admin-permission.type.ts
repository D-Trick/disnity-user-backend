// types
import type { SqlOptions } from '@common/types/sql-options.type';
// lib
import { FindManyOptions, QueryRunner } from 'typeorm';
// entities
import { User } from '@databases/entities/user.entity';
import { GuildAdminPermission } from '@databases/entities/guild-admin-permission.entity';

// ----------------------------------------------------------------------

/******************************
 * Find
 ******************************/
export interface CFindOptions extends Omit<FindManyOptions<GuildAdminPermission>, 'transaction'> {
    transaction?: QueryRunner;
}
export interface CFindOneOptions extends Omit<FindManyOptions<GuildAdminPermission>, 'transaction'> {
    transaction?: QueryRunner;
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
