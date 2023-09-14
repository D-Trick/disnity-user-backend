// types
import type { Count } from '@databases/types/global';
import type { TotalTagGuildsCountOptions } from '@databases/types/tag.type';
// lib
import { Repository } from 'typeorm';
// utils
import { createSelectQueryBuilder } from '@databases/utils/createQueryBuilder';
// alias
import { TAG_TABLE_ALIAS as TABLE_ALIAS } from '@databases/common/table-alias';
// entities
import { Tag } from '@databases/entities/tag.entity';

// ----------------------------------------------------------------------

export async function totalTagGuildsCount(
    repository: Repository<Tag>,
    options: TotalTagGuildsCountOptions,
): Promise<Count> {
    const { transaction, where } = options || {};
    const { tag_name, min, max } = where || {};

    const qb = createSelectQueryBuilder<Tag>(Tag, TABLE_ALIAS, {
        repository,
        transaction,
    });

    // SELECT
    qb.select([`COUNT(*) AS count`]);

    // JOIN
    qb.innerJoin('guild', 'guild', `guild.id = ${TABLE_ALIAS}.guild_id`);

    // WHERE
    qb.andWhere(`guild.refresh_date >= date_add(NOW(), interval - 1 month)`);
    qb.andWhere('guild.is_open = 1');
    qb.andWhere('guild.is_admin_open = 1');
    qb.andWhere(`guild.is_bot = 1`);
    qb.andWhere(`${TABLE_ALIAS}.name = :tag_name`, { tag_name });
    if (min === 5000 && max === 5000) {
        qb.andWhere('member >= 5000');
    } else if ((min >= 1 && max < 5000) || (min > 1 && max <= 5000)) {
        qb.andWhere('member BETWEEN :min AND :max', {
            min,
            max,
        });
    }

    return qb.getRawOne();
}
