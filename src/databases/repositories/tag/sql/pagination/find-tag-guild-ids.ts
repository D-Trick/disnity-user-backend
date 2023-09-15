// types
import type { FindTagGuildIdsOptions } from '@databases/types/tag.type';
// lib
import { Repository } from 'typeorm';
// utils
import { createSelectQueryBuilder } from '@databases/utils/createQueryBuilder';
// alias
import { TAG_TABLE_ALIAS as TABLE_ALIAS } from '@databases/common/table-alias';
// entities
import { Tag } from '@databases/entities/tag.entity';

// ----------------------------------------------------------------------

export async function findTagGuildIds(repository: Repository<Tag>, options: FindTagGuildIdsOptions): Promise<number[]> {
    const { transaction, where, orderBy, limit, offset } = options || {};
    const { tag_name, min, max } = where || {};
    const { sort } = orderBy || {};

    const qb = createSelectQueryBuilder<Tag>(Tag, TABLE_ALIAS, {
        repository,
        transaction,
    });

    // SELECT
    qb.select([`${TABLE_ALIAS}.guild_id AS guild_id`]);

    // JOIN
    qb.innerJoin('guild', 'guild', `guild.id = ${TABLE_ALIAS}.guild_id`);

    // WHERE
    qb.where('guild.refresh_date >= date_add(NOW(), interval - 1 month)');
    qb.andWhere('guild.is_open = 1');
    qb.andWhere('guild.is_admin_open = 1');
    qb.andWhere('guild.is_bot = 1');
    if (min === 5000 && max === 5000) {
        qb.andWhere('guild.member >= 5000');
    } else if ((min >= 1 && max < 5000) || (min > 1 && max <= 5000)) {
        qb.andWhere('guild.member BETWEEN :min AND :max', {
            min,
            max,
        });
    }
    if (tag_name) qb.andWhere(`${TABLE_ALIAS}.name = :tag_name`, { tag_name });

    // GROUP BY
    qb.groupBy(`${TABLE_ALIAS}.guild_id`);
    if (sort) qb.addGroupBy(`guild.${sort}`);

    // ORDER BY
    if (sort) qb.orderBy(`guild.${sort}`, 'DESC');

    // limit, offset
    qb.limit(limit).offset(offset);

    const tagGuilds = await qb.getRawMany();

    const tagGuildIds = [];
    const length = tagGuilds.length;
    for (let i = 0; i < length; i++) {
        const guild = tagGuilds[i];

        tagGuildIds.push(guild.guild_id);
    }

    return tagGuildIds;
}
