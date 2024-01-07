// types
import type { FindSearchGuildIdsOptions } from '@databases/types/guild.type';
// lib
import { Repository, Brackets } from 'typeorm';
// utils
import { createSelectQueryBuilder } from '@databases/utils/createQueryBuilder';
// alias
import { GUILD_TABLE_ALIAS as TABLE_ALIAS } from '@databases/common/table-alias';
// entities
import { Guild } from '@databases/entities/guild.entity';

// ----------------------------------------------------------------------

export async function findSearchGuildIds(
    repository: Repository<Guild>,
    options: FindSearchGuildIdsOptions,
): Promise<number[]> {
    const { transaction, where, orderBy, limit, offset } = options || {};
    const { keyword, min, max } = where || {};
    const { sort } = orderBy || {};

    const qb = createSelectQueryBuilder<Guild>(Guild, TABLE_ALIAS, {
        repository,
        transaction,
    });

    // SELECT
    qb.select([`${TABLE_ALIAS}.id AS id`]);

    // JOIN
    qb.leftJoin('tag', 'tag', `${TABLE_ALIAS}.id = tag.guild_id`);

    // WHERE
    qb.where(`${TABLE_ALIAS}.refresh_date >= date_add(NOW(), interval - 1 month)`);
    qb.andWhere(`${TABLE_ALIAS}.is_open = 1`);
    qb.andWhere(`${TABLE_ALIAS}.is_admin_open = 1`);
    qb.andWhere(`${TABLE_ALIAS}.is_bot = 1`);
    if (min === 5000 && max === 5000) {
        qb.andWhere(`${TABLE_ALIAS}.member >= 5000`);
    } else if ((min >= 1 && max < 5000) || (min > 1 && max <= 5000)) {
        qb.andWhere(`${TABLE_ALIAS}.member BETWEEN :min AND :max`, {
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

    // GROUP BY
    qb.groupBy(`${TABLE_ALIAS}.id`);

    // ORDER BY
    if (sort) qb.addOrderBy(`${TABLE_ALIAS}.${sort}`, 'DESC');
    qb.addOrderBy(`${TABLE_ALIAS}.id`);

    // LIMIT, OFFSET
    qb.limit(limit).offset(offset);

    const guilds = await qb.getRawMany();

    const guildIds = [];
    const { length } = guilds;
    for (let i = 0; i < length; i++) {
        const guild = guilds[i];

        guildIds.push(guild.id);
    }

    return guildIds;
}
