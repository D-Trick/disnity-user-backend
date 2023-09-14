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
import { GUILD_TABLE_ALIAS as TABLE_ALIAS } from '@databases/common/table-alias';
// entities
import { Guild } from '@databases/entities/guild.entity';

// ----------------------------------------------------------------------

export async function findSitemapUrls(repository: Repository<Guild>, options: SqlOptions): Promise<FindSitemapUrls[]> {
    const { transaction } = options || {};

    const qb = createSelectQueryBuilder<Guild>(Guild, TABLE_ALIAS, {
        repository,
        transaction,
    });

    // SELECT
    qb.select([`CONCAT('${baseConfig.url}', '/servers/', id) as url`]);

    // WHERE
    qb.andWhere('refresh_date >= date_add(NOW(), interval - 1 month)');
    qb.andWhere('is_open = 1');
    qb.andWhere('is_admin_open = 1');
    qb.andWhere('is_bot = 1');

    return qb.getRawMany();
}
