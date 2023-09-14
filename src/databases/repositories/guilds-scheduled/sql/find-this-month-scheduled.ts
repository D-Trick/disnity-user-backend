// types
import type { SqlOptions } from '@common/types/sql-options.type';
import type { FindThisMonthScheduled } from '@databases/types/guilds-scheduled.type';
// lib
import { Repository } from 'typeorm';
// utils
import { createSelectQueryBuilder } from '@databases/utils/createQueryBuilder';
// alias
import { GUILD_SCHEDULED_TABLE_ALIAS as TABLE_ALIAS } from '@databases/common/table-alias';
// entities
import { GuildScheduled } from '@databases/entities/guild-scheduled.entity';

// ----------------------------------------------------------------------

export async function findThisMonthScheduled(
    repository: Repository<GuildScheduled>,
    options: SqlOptions,
): Promise<FindThisMonthScheduled[]> {
    const { transaction } = options || {};

    const qb = createSelectQueryBuilder<GuildScheduled>(GuildScheduled, TABLE_ALIAS, {
        repository,
        transaction,
    });

    // SELECT
    qb.select([
        `${TABLE_ALIAS}.id                                   AS id`,
        'guild.id                                            AS guild_id',
        'guild.name                                          AS guild_name',
        'guild.icon                                          AS guild_icon',
        `${TABLE_ALIAS}.name                                 AS name`,
        `${TABLE_ALIAS}.description                          AS description`,
        `DATE_FORMAT(scheduled_start_time, '%Y-%m-%d %H:%i') AS scheduled_start_time`,
        `DATE_FORMAT(scheduled_end_time, '%Y-%m-%d %H:%i')   AS scheduled_end_time`,
        `${TABLE_ALIAS}.image                                AS image`,
    ]);

    // JOIN
    qb.leftJoin('guild', 'guild', `guild.id = ${TABLE_ALIAS}.guild_id`);

    // WHERE
    qb.andWhere(`guild.refresh_date >= date_add(NOW(), interval - 1 month)`);
    qb.andWhere(`scheduled_start_time >= UNIX_TIMESTAMP(CONCAT(DATE_FORMAT(NOW(), '%Y-%m-01'), ' 00:00:00'))`);
    qb.andWhere(`scheduled_end_time <= UNIX_TIMESTAMP(LAST_DAY(NOW()) + INTERVAL 1 DAY - INTERVAL 1 SECOND)`);

    return qb.getRawMany();
}
