// types
import type { SqlOptions } from '@common/types/sql-options.type';
import type { FindSitemapUrls } from '@databases/types/guild.type';
// lib
import { Repository } from 'typeorm';
// utils
import { createSelectQueryBuilder } from '@databases/utils/createQueryBuilder';
// configs
import { baseConfig } from '@config/basic.config';
// alias
import { TAG_TABLE_ALIAS as TABLE_ALIAS } from '@databases/common/table-alias';
// entities
import { Tag } from '@databases/entities/tag.entity';

// ----------------------------------------------------------------------

export async function findSitemapUrls(repository: Repository<Tag>, options: SqlOptions): Promise<FindSitemapUrls[]> {
    const { transaction } = options || {};

    const qb = createSelectQueryBuilder<Tag>(Tag, TABLE_ALIAS, {
        repository,
        transaction,
    });

    // SELECT
    qb.select([`CONCAT('${baseConfig.url}', '/servers/tags/', ${TABLE_ALIAS}.name) as url`]);

    // JOIN
    qb.leftJoin('guild', 'guild', `guild.id = ${TABLE_ALIAS}.guild_id`);

    // GROUP BY
    qb.groupBy(`${TABLE_ALIAS}.name`);

    // WHERE
    qb.andWhere(`guild.refresh_date >= date_add(NOW(), interval - 1 month)`);

    return qb.getRawMany();
}
