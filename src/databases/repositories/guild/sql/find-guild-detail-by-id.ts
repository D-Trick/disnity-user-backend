// types
import type { FindGuildDetailById, FindGuildDetailByIdOptions } from '@databases/types/guild.type';
// lib
import { Repository } from 'typeorm';
// utils
import { createSelectQueryBuilder } from '@databases/utils/createQueryBuilder';
// alias
import { GUILD_TABLE_ALIAS as TABLE_ALIAS } from '@databases/common/table-alias';
// entities
import { Guild } from '@databases/entities/guild.entity';

// ----------------------------------------------------------------------

export async function findGuildDetailById(
    repository: Repository<Guild>,
    options: FindGuildDetailByIdOptions,
): Promise<FindGuildDetailById> {
    const { transaction, where } = options || {};
    const { id } = where || {};

    const qb = createSelectQueryBuilder<Guild>(Guild, TABLE_ALIAS, {
        repository,
        transaction,
    });

    // SELECT
    qb.select([
        `${TABLE_ALIAS}.id                                               AS id`,
        `${TABLE_ALIAS}.name                                             AS name`,
        `${TABLE_ALIAS}.summary                                          AS summary`,
        `${TABLE_ALIAS}.content                                          AS content`,
        `${TABLE_ALIAS}.is_markdown                                      AS is_markdown`,
        `${TABLE_ALIAS}.icon                                             AS icon`,
        `${TABLE_ALIAS}.splash                                           AS splash`,
        `${TABLE_ALIAS}.online                                           AS online`,
        `${TABLE_ALIAS}.member                                           AS member`,
        `${TABLE_ALIAS}.premium_tier                                     AS premium_tier`,
        `${TABLE_ALIAS}.link_type                                        AS link_type`,
        `${TABLE_ALIAS}.invite_code                                      AS invite_code`,
        `${TABLE_ALIAS}.membership_url                                   AS membership_url`,

        `DATE_FORMAT(${TABLE_ALIAS}.created_at, '%Y-%m-%d %H:%i:%S')     AS created_at`,
        `DATE_FORMAT(${TABLE_ALIAS}.refresh_date, '%Y-%m-%d %H:%i:%s')   AS refresh_date`,
    ]);
    // SELECT common
    qb.addSelect(['comm.name                                             AS category_name']);

    // JOIN
    qb.leftJoin('common_code', 'comm', `comm.code = 'category' AND comm.value = ${TABLE_ALIAS}.category_id`);

    // WHERE
    qb.andWhere(`${TABLE_ALIAS}.refresh_date >= date_add(NOW(), interval - 1 month)`);
    qb.andWhere(`${TABLE_ALIAS}.id = :id`, { id });
    qb.andWhere(`${TABLE_ALIAS}.is_admin_open = 1`);
    qb.andWhere(`${TABLE_ALIAS}.is_open = 1`);
    qb.andWhere(`${TABLE_ALIAS}.is_bot = 1`);

    return qb.getRawOne();
}
