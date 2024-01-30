// types
import type { Count } from '@databases/types/global';
import type { TotalCategoryGuildsCountOptions } from '@databases/types/guild.type';
// lib
import { Repository } from 'typeorm';
// utils
import { createSelectQueryBuilder } from '@utils/database/create-query-builder';
// alias
import { GUILD_TABLE_ALIAS as TABLE_ALIAS } from '@databases/common/table-alias';
// entities
import { Guild } from '@databases/entities/guild.entity';

// ----------------------------------------------------------------------

export async function totalCategoryGuildsCount(
    repository: Repository<Guild>,
    options: TotalCategoryGuildsCountOptions,
): Promise<Count> {
    const { transaction, where } = options || {};
    const { category_id, min, max } = where || {};

    const qb = createSelectQueryBuilder<Guild>(Guild, TABLE_ALIAS, {
        repository,
        transaction,
    });

    // SELECT
    qb.select([`COUNT(*) AS count`]);

    // JOIN
    qb.leftJoin(
        'common_code',
        'comm',
        `comm.code = 'category'
         AND comm.value = ${TABLE_ALIAS}.category_id`,
    );

    // WHERE
    qb.andWhere(`${TABLE_ALIAS}.refresh_date >= date_add(NOW(), interval - 1 month)`);
    qb.andWhere(`${TABLE_ALIAS}.is_open = 1`);
    qb.andWhere(`${TABLE_ALIAS}.is_admin_open = 1`);
    qb.andWhere(`${TABLE_ALIAS}.is_bot = 1`);
    if (category_id) {
        qb.andWhere('comm.value = :category_id', { category_id });
    }
    if (min === 5000 && max === 5000) {
        qb.andWhere('member >= 5000');
    } else if ((min >= 1 && max < 5000) || (min > 1 && max <= 5000)) {
        qb.andWhere('member >= :min AND member <= :max', {
            min,
            max,
        });
    }

    return qb.getRawOne();
}
