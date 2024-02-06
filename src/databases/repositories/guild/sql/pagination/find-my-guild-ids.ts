// types
import type { FindMyGuildIdsOptions } from '@databases/types/guild.type';
// lib
import { Brackets, Repository } from 'typeorm';
// utils
import { createSelectQueryBuilder } from '@utils/database/create-query-builder';
// alias
import { GUILD_TABLE_ALIAS as TABLE_ALIAS } from '@databases/common/table-alias';
// entities
import { Guild } from '@databases/entities/guild.entity';

// ----------------------------------------------------------------------

export async function findMyGuildIds(repository: Repository<Guild>, options: FindMyGuildIdsOptions): Promise<number[]> {
    const { transaction, where, limit, offset } = options || {};
    const { user_id } = where || {};

    const qb = createSelectQueryBuilder<Guild>(Guild, TABLE_ALIAS, {
        repository,
        transaction,
    });

    // SELECT
    qb.select([`${TABLE_ALIAS}.id AS id`]);

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

    // ORDER BY
    qb.addOrderBy(`${TABLE_ALIAS}.refresh_date`, 'DESC');
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
