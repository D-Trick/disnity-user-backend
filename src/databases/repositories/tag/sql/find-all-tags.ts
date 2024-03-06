// types
import type { SqlOptions } from '@common/types/sql-options.type';
import type { FindAllTags } from '@databases/types/tag.type';
// lib
import { Repository } from 'typeorm';
// utils
import { createSelectQueryBuilder } from '@utils/database/create-query-builder';
// alias
import { TAG_TABLE_ALIAS as TABLE_ALIAS } from '@databases/common/table-alias';
// entities
import { Tag } from '@databases/entities/tag.entity';

// ----------------------------------------------------------------------

export async function findAllTags(repository: Repository<Tag>, options: SqlOptions): Promise<FindAllTags[]> {
    const { transaction } = options || {};

    const qb = createSelectQueryBuilder<Tag>(Tag, TABLE_ALIAS, {
        repository,
        transaction,
    });

    // SELECT
    qb.select([
        `${TABLE_ALIAS}.name                               AS name`,
        `IFNULL(COUNT(${TABLE_ALIAS}.name), 0)             AS total `,
    ]);

    // JOIN
    qb.innerJoin('guild', 'guild', `guild.id = ${TABLE_ALIAS}.guild_id`);

    // WHERE
    qb.andWhere('guild.refresh_date >= date_add(NOW(), interval - 1 month)');
    qb.andWhere('guild.is_open = 1');
    qb.andWhere('guild.is_admin_open = 1');
    qb.andWhere(`guild.is_bot = 1`);

    // GROUP BY
    qb.groupBy(`${TABLE_ALIAS}.name`);

    // ORDER BY
    qb.orderBy('total', 'DESC').addOrderBy('name');

    return qb.getRawMany();
}
