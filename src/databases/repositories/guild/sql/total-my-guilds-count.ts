// types
import type { Count } from '@databases/types/global';
import type { TotalMyGuildsCountOptions } from '@databases/types/guild.type';
// lib
import { Brackets, Repository } from 'typeorm';
// utils
import { createSelectQueryBuilder } from '@utils/database/createQueryBuilder';
// alias
import { GUILD_TABLE_ALIAS as TABLE_ALIAS } from '@databases/common/table-alias';
// entities
import { Guild } from '@databases/entities/guild.entity';

// ----------------------------------------------------------------------

export async function totalMyGuildsCount(
    repository: Repository<Guild>,
    options: TotalMyGuildsCountOptions,
): Promise<Count> {
    const { transaction, where } = options || {};
    const { user_id } = where || {};

    const qb = createSelectQueryBuilder<Guild>(Guild, TABLE_ALIAS, {
        repository,
        transaction,
    });

    // SELECT
    qb.select([`COUNT(*) AS count`]);

    // join
    qb.leftJoin(
        'guild_admin_permission',
        'gap',
        `gap.guild_id = ${TABLE_ALIAS}.id AND gap.user_id = :user_id
    `,
        { user_id },
    );

    // WHERE
    qb.andWhere(
        new Brackets((qb) => {
            qb.where(`${TABLE_ALIAS}.user_id = :user_id`, { user_id });
            qb.orWhere('gap.user_id = :user_id', { user_id });
        }),
    );

    return qb.getRawOne();
}
