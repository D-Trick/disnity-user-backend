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
    const { guild_id, user_id } = where || {};

    const qb = createSelectQueryBuilder<GuildAdminPermission>(GuildAdminPermission, TABLE_ALIAS, {
        repository,
        transaction,
    });

    // SELECT
    qb.select([`${TABLE_ALIAS}.is_owner AS is_owner`]);
    // SELECT user
    qb.addSelect([
        'user.id                AS id',
        'user.global_name       AS global_name',
        'user.username          AS username',
        'user.avatar            AS avatar',
        'user.discriminator     AS discriminator',
    ]);

    // JOIN
    qb.leftJoin('user', 'user', `user.id = ${TABLE_ALIAS}.user_id`);

    // WHERE
    if (guild_id) qb.andWhere(`${TABLE_ALIAS}.guild_id = :guild_id`, { guild_id });
    if (user_id) qb.andWhere(`${TABLE_ALIAS}.user_id = :user_id`, { user_id });

    // ORDER BY
    qb.orderBy(`${TABLE_ALIAS}.is_owner`, 'DESC');

    return qb.getRawMany();
}
