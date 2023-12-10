// types
import type { FindMyGuildDetailById, FindMyGuildDetailByIdOptions } from '@databases/types/guild.type';
// lib
import { Brackets, Repository } from 'typeorm';
// utils
import Nplus1 from '@databases/utils/n-plus-1';
import { createSelectQueryBuilder } from '@databases/utils/createQueryBuilder';
// alias
import { GUILD_TABLE_ALIAS as TABLE_ALIAS } from '@databases/common/table-alias';
// entities
import { Guild } from '@databases/entities/guild.entity';

// ----------------------------------------------------------------------

export async function findMyGuildDetailById(
    repository: Repository<Guild>,
    options: FindMyGuildDetailByIdOptions,
): Promise<FindMyGuildDetailById> {
    const { transaction, where } = options || {};
    const { id, user_id } = where || {};

    const qb = createSelectQueryBuilder<Guild>(Guild, TABLE_ALIAS, {
        repository,
        transaction,
    });

    // SELECT
    qb.select([
        `${TABLE_ALIAS}.id                                                      AS id`,
        `${TABLE_ALIAS}.category_id                                             AS category_id`,
        `${TABLE_ALIAS}.name                                                    AS name`,
        `${TABLE_ALIAS}.summary                                                 AS summary`,
        `${TABLE_ALIAS}.content                                                 AS content`,
        `${TABLE_ALIAS}.is_markdown                                             AS is_markdown`,
        `${TABLE_ALIAS}.icon                                                    AS icon`,
        `${TABLE_ALIAS}.splash                                                  AS splash`,
        `${TABLE_ALIAS}.online                                                  AS online`,
        `${TABLE_ALIAS}.member                                                  AS member`,
        `${TABLE_ALIAS}.premium_tier                                            AS premium_tier`,
        `${TABLE_ALIAS}.link_type                                               AS link_type`,
        `${TABLE_ALIAS}.invite_code                                             AS invite_code`,
        `${TABLE_ALIAS}.membership_url                                          AS membership_url`,
        `${TABLE_ALIAS}.is_open                                                 AS is_open`,

        `DATE_FORMAT(${TABLE_ALIAS}.created_at, '%Y-%m-%d %H:%i:%S')            AS created_at`,
        `DATE_FORMAT(${TABLE_ALIAS}.refresh_date, '%Y-%m-%d %H:%i:%s')          AS refresh_date`,
    ]);
    // SELECT common
    qb.addSelect(['comm.name                                                    AS category_name']);
    // SELECT tag
    qb.addSelect([
        `tag.guild_id                                                           AS tag_guild_id`,
        `tag.name                                                               AS tag_name`,
    ]);
    // SELECT guild_admin_permission
    qb.addSelect([
        `admin.guild_id                                                         AS admin_guild_id`,
        `admin.is_owner                                                         AS admin_is_owner`,
    ]);
    // SELECT user
    qb.addSelect([
        'user.id                                                                AS admin_id',
        'user.global_name                                                       AS admin_global_name',
        'user.username                                                          AS admin_username',
        'user.avatar                                                            AS admin_avatar',
        'user.discriminator                                                     AS admin_discriminator',
    ]);

    // JOIN
    qb.leftJoin('common_code', 'comm', `comm.code = 'category' AND comm.value = ${TABLE_ALIAS}.category_id`);
    qb.leftJoin('tag', 'tag', `tag.guild_id = ${TABLE_ALIAS}.id`);
    qb.leftJoin('guild_admin_permission', 'admin', `admin.guild_id = ${TABLE_ALIAS}.id`);
    qb.leftJoin('user', 'user', 'user.id = admin.user_id');

    // WHERE
    qb.andWhere(`${TABLE_ALIAS}.id = :id`, { id });
    qb.andWhere(
        new Brackets((qb) => {
            qb.where(`${TABLE_ALIAS}.user_id = :user_id`, { user_id });
            qb.orWhere('admin.user_id = :user_id', { user_id });
        }),
    );

    // ORDER BY
    qb.orderBy('tag.sort');
    qb.addOrderBy('admin.is_owner', 'DESC');

    // N + 1 FORMAT
    const queryResult = await qb.getRawMany();

    const n1 = new Nplus1<FindMyGuildDetailById>(queryResult, {
        primaryColumn: 'id',
        joinGroups: [
            {
                outputColumn: 'tags',
                referenceColumn: 'tag_guild_id',
                selectColumns: [{ originalName: 'tag_name', changeName: 'name' }],
            },
            {
                outputColumn: 'admins',
                referenceColumn: 'admin_guild_id',
                selectColumns: [
                    { originalName: 'admin_id', changeName: 'id' },
                    { originalName: 'admin_global_name', changeName: 'global_name' },
                    { originalName: 'admin_username', changeName: 'username' },
                    { originalName: 'admin_avatar', changeName: 'avatar' },
                    { originalName: 'admin_discriminator', changeName: 'discriminator' },
                    { originalName: 'admin_is_owner', changeName: 'is_owner' },
                ],
            },
        ],
    });

    return n1.getOne();
}
