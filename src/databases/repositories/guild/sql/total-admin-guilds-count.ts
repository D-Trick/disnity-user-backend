// types
import type { Count } from '@databases/types/global';
import type { TotalGuildAdminsCountOptions } from '@databases/types/guild.type';
// lib
import { Repository, Brackets } from 'typeorm';
// utils
import { createSelectQueryBuilder } from '@utils/database/createQueryBuilder';
// alias
import { GUILD_TABLE_ALIAS as TABLE_ALIAS } from '@databases/common/table-alias';
// entities
import { Guild } from '@databases/entities/guild.entity';

// ----------------------------------------------------------------------

export async function totalGuildAdminsCount(
    repository: Repository<Guild>,
    options: TotalGuildAdminsCountOptions,
): Promise<Count> {
    const { transaction, where } = options || {};
    const { id, user_id } = where || {};

    const qb = createSelectQueryBuilder<Guild>(Guild, TABLE_ALIAS, {
        repository,
        transaction,
    });

    // SELECT
    qb.select([`COUNT(DISTINCT ${TABLE_ALIAS}.id) AS count`]);

    // JOIN
    qb.leftJoin('guild_admin_permission', 'admin', `${TABLE_ALIAS}.id = admin.guild_id`);

    // WHERE
    qb.andWhere(`${TABLE_ALIAS}.id = :id`, { id });
    qb.andWhere(
        new Brackets((qb) => {
            qb.where(`${TABLE_ALIAS}.user_id = :user_id`, { user_id });
            qb.orWhere('admin.user_id = :user_id', { user_id });
        }),
    );

    return qb.getRawOne();
}
