// types
import type { SqlOptions } from '@common/types/sql-options.type';
// lib
import { Repository } from 'typeorm';
// utils
import { createSelectQueryBuilder } from '@utils/database/create-query-builder';
// alias
import { TAG_TABLE_ALIAS as TABLE_ALIAS } from '@databases/common/table-alias';
// entities
import { Tag } from '@databases/entities/tag.entity';

// ----------------------------------------------------------------------

export async function findSitemapData(repository: Repository<Tag>, options: SqlOptions): Promise<Pick<Tag, 'name'>[]> {
    const { transaction } = options || {};

    const qb = createSelectQueryBuilder<Tag>(Tag, TABLE_ALIAS, {
        repository,
        transaction,
    });

    // SELECT
    qb.select([`${TABLE_ALIAS}.name as name`]);

    // JOIN
    qb.leftJoin('guild', 'guild', `guild.id = ${TABLE_ALIAS}.guild_id`);

    // WHERE
    qb.andWhere(`guild.refresh_date >= date_add(NOW(), interval - 1 month)`);
    qb.andWhere(`guild.is_bot = 1`);
    qb.andWhere(`guild.is_open = 1`);
    qb.andWhere(`guild.is_admin_open = 1`);

    // GROUP BY
    qb.groupBy(`${TABLE_ALIAS}.name`);

    return qb.getRawMany();
}
