// types
import type { FindGuildAdmins, FindGuildAdminsOptions } from '@databases/types/guild-admin-permission.type';
// lib
import { Repository } from 'typeorm';
// utils
import { createSelectQueryBuilder } from '@databases/utils/createQueryBuilder';
// alias
import { GUILD_ADMIN_PERMISSION_TABLE_ALIAS as TABLE_ALIAS } from '@databases/common/table-alias';
// entities
import { GuildAdminPermission } from '@databases/entities/guild-admin-permission.entity';

// ----------------------------------------------------------------------

export async function findGuildAdmins(
    repository: Repository<GuildAdminPermission>,
    options: FindGuildAdminsOptions,
): Promise<FindGuildAdmins[]> {
    const { transaction, where } = options || {};
    const { guild_id, user_id, server_guild_id } = where || {};

    const qb = createSelectQueryBuilder<GuildAdminPermission>(GuildAdminPermission, TABLE_ALIAS, {
        repository,
        transaction,
    });

    // SELECT
    qb.select([
        `${TABLE_ALIAS}.id              AS id`,
        'guild.id              AS server_guild_id',
        `${TABLE_ALIAS}.guild_id        AS guild_id`,
        `${TABLE_ALIAS}.user_id         AS user_id`,
    ]);

    // JOIN
    qb.leftJoin('guild', 'guild', `guild.id = ${TABLE_ALIAS}.guild_id`);

    if (user_id) qb.andWhere(`${TABLE_ALIAS}.user_id = :user_id`, { user_id });
    if (server_guild_id) qb.andWhere('guild.id = :server_guild_id', { server_guild_id });
    if (guild_id) qb.andWhere(`${TABLE_ALIAS}.guild_id = :guild_id`, { guild_id });

    return qb.getRawOne();
}
