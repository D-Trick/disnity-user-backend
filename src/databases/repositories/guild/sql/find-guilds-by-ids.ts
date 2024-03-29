// types
import type { FindGuildsByIdsOptions, FindGuildsByIdsSqlName, FindGuildsByIds } from '@databases/types/guild.type';
// lib
import { Repository } from 'typeorm';
// utils
import { Nplus1 } from '@utils/database';
import { createSelectQueryBuilder } from '@utils/database/create-query-builder';
// alias
import { GUILD_TABLE_ALIAS as TABLE_ALIAS } from '@databases/common/table-alias';
// entities
import { Guild } from '@databases/entities/guild.entity';

// ----------------------------------------------------------------------
const selectBase = [
    `${TABLE_ALIAS}.id              AS id`,
    `${TABLE_ALIAS}.name            AS name`,
    `${TABLE_ALIAS}.summary         AS summary`,
    `${TABLE_ALIAS}.icon            AS icon`,
    `${TABLE_ALIAS}.online          AS online`,
    `${TABLE_ALIAS}.member          AS member`,
    `${TABLE_ALIAS}.banner          AS banner`,
    `${TABLE_ALIAS}.link_type       AS link_type`,

    `${TABLE_ALIAS}.refresh_date    AS refresh_date`,
];

const selectMyServer = [
    `${TABLE_ALIAS}.id              AS id`,
    `${TABLE_ALIAS}.name            AS name`,
    `${TABLE_ALIAS}.summary         AS summary`,
    `${TABLE_ALIAS}.icon            AS icon`,
    `${TABLE_ALIAS}.online          AS online`,
    `${TABLE_ALIAS}.member          AS member`,
    `${TABLE_ALIAS}.banner          AS banner`,
    `${TABLE_ALIAS}.link_type       AS link_type`,
    `${TABLE_ALIAS}.invite_code     AS invite_code`,
    `${TABLE_ALIAS}.is_open         AS is_open`,
    `${TABLE_ALIAS}.is_admin_open   AS is_admin_open`,
    `${TABLE_ALIAS}.private_reason  AS private_reason`,
    `${TABLE_ALIAS}.is_bot          AS is_bot`,
    `${TABLE_ALIAS}.user_id         AS user_id`,

    `${TABLE_ALIAS}.refresh_date    AS refresh_date`,
];
// ----------------------------------------------------------------------

export async function findGuildsByIds<T extends FindGuildsByIdsSqlName>(
    repository: Repository<Guild>,
    options: FindGuildsByIdsOptions,
): Promise<FindGuildsByIds[T][]> {
    const { transaction, select, where, orderBy } = options || {};
    const { sql } = select || {};
    const { sort } = orderBy || {};
    const { IN } = where || {};
    const { ids } = IN || {};

    const qb = createSelectQueryBuilder<Guild>(Guild, TABLE_ALIAS, {
        repository,
        transaction,
    });

    // SELECT
    if (sql) {
        const { base, myGuild } = sql || {};

        if (base) qb.select(selectBase);
        if (myGuild) qb.select(selectMyServer);
    } else {
        throw new Error('[guild/findGuildsByIds] Select option Empty');
    }

    // SELECT common
    qb.addSelect(['comm.name                                                    AS category_name']);
    // SELECT tag
    qb.addSelect([
        `tag.id                                                                 AS tag_id`,
        `tag.guild_id                                                           AS tag_guild_id`,
        `tag.name                                                               AS tag_name`,
    ]);

    // JOIN
    qb.leftJoin('common_code', 'comm', `comm.code = 'category' AND comm.value = ${TABLE_ALIAS}.category_id`);
    qb.leftJoin('tag', 'tag', `tag.guild_id = ${TABLE_ALIAS}.id`);

    // WHERE
    qb.where(`${TABLE_ALIAS}.id IN (:ids)`, { ids });

    // ORDER BY
    if (sort) qb.addOrderBy(`${TABLE_ALIAS}.${sort}`, 'DESC');
    qb.addOrderBy(`${TABLE_ALIAS}.id`);
    qb.addOrderBy(`tag.sort`);

    // N + 1 FORMAT
    const queryResult = await qb.getRawMany();

    const n1 = new Nplus1<FindGuildsByIds[T]>(queryResult, {
        primaryColumn: 'id',
        joinGroups: [
            {
                outputColumn: 'tags',
                referenceColumn: 'tag_guild_id',
                selectColumns: [
                    { originalName: 'tag_id', changeName: 'id' },
                    { originalName: 'tag_name', changeName: 'name' },
                ],
            },
        ],
    });

    return n1.getMany();
}
