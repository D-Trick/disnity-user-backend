// types
import type { Count } from '@databases/types/global';
import type { TotalSearchGuildsCountOptions } from '@databases/types/guild.type';
// lib
import { Repository, Brackets } from 'typeorm';
// utils
import { createSelectQueryBuilder } from '@utils/database/create-query-builder';
// alias
import { GUILD_TABLE_ALIAS as TABLE_ALIAS } from '@databases/common/table-alias';
// entities
import { Guild } from '@databases/entities/guild.entity';

// ----------------------------------------------------------------------

export async function totalSearchGuildsCount(
    repository: Repository<Guild>,
    options: TotalSearchGuildsCountOptions,
): Promise<Count> {
    const { transaction, where } = options || {};
    const { keyword, min, max } = where || {};

    const qb = createSelectQueryBuilder<Guild>(Guild, TABLE_ALIAS, {
        repository,
        transaction,
    });

    // SELECT
    qb.select([`COUNT(DISTINCT ${TABLE_ALIAS}.id) AS count`]);

    // JOIN
    qb.leftJoin('tag', 'tag', `${TABLE_ALIAS}.id = tag.guild_id`);

    // WHERE
    qb.andWhere(`${TABLE_ALIAS}.refresh_date >= date_add(NOW(), interval - 1 month)`);
    qb.andWhere(`${TABLE_ALIAS}.is_open = 1`);
    qb.andWhere(`${TABLE_ALIAS}.is_admin_open = 1`);
    qb.andWhere(`${TABLE_ALIAS}.is_bot = 1`);
    if (min === 5000 && max === 5000) {
        qb.andWhere('member >= 5000');
    } else if ((min >= 1 && max < 5000) || (min > 1 && max <= 5000)) {
        qb.andWhere('member BETWEEN :min AND :max', {
            min,
            max,
        });
    }
    qb.andWhere(
        new Brackets((qb) => {
            qb.where(`${TABLE_ALIAS}.name LIKE concat('%', LOWER(replace(:keyword, ' ', '')), '%')`, { keyword })
                .orWhere(`${TABLE_ALIAS}.summary LIKE concat('%', LOWER(replace(:keyword, ' ', '')), '%')`, {
                    keyword,
                })
                .orWhere(`tag.name LIKE concat('%', LOWER(replace(:keyword, ' ', '')), '%')`, { keyword });
        }),
    );

    return qb.getRawOne();
}
