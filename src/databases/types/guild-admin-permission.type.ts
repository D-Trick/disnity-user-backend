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
    where: {
        user_id?: GuildAdminPermission['user_id'];
        guild_id?: GuildAdminPermission['guild_id'];
    };
}

export type FindGuildAdmins = {
    is_owner: GuildAdminPermission['is_owner'];

    id: User['id'];
    global_name: User['global_name'];
    username: User['username'];
    avatar: User['avatar'];
    discriminator: User['discriminator'];
};

/******************************
 * 쓰기, 수정, 삭제
 ******************************/
export interface InsertOptions extends SqlOptions {
    values: GuildAdminPermission | GuildAdminPermission[];
}
export interface UpdateOptions extends SqlOptions {
    values: Partial<GuildAdminPermission>;
    where: {
        user_id?: GuildAdminPermission['user_id'];
        guild_id?: GuildAdminPermission['guild_id'];
    };
}
export interface DeleteOptions extends SqlOptions {
    where: {
        user_id?: GuildAdminPermission['user_id'];
        guild_id?: GuildAdminPermission['guild_id'];

        IN?: {
            user_ids?: GuildAdminPermission['guild_id'][];
        };
    };
}
