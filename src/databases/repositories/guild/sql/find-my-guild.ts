// types
import type { FindMyGuildOptions } from '@databases/types/guild.type';
// lib
import { Brackets, Repository } from 'typeorm';
// utils
import { createSelectQueryBuilder } from '@utils/database/create-query-builder';
// alias
import { GUILD_TABLE_ALIAS as TABLE_ALIAS } from '@databases/common/table-alias';
// entities
import { Guild } from '@databases/entities/guild.entity';

// ----------------------------------------------------------------------

export async function findMyGuild(repository: Repository<Guild>, options: FindMyGuildOptions): Promise<Guild> {
    const { transaction, where } = options || {};
    const { id, user_id } = where || {};

    const qb = createSelectQueryBuilder<Guild>(Guild, TABLE_ALIAS, {
        repository,
        transaction,
    });

    // SELECT
    qb.select([
        `${TABLE_ALIAS}.id              AS id`,
        `${TABLE_ALIAS}.user_id         AS user_id`,
        `${TABLE_ALIAS}.category_id     AS category_id`,
        `${TABLE_ALIAS}.name            AS name`,
        `${TABLE_ALIAS}.summary         AS summary`,
        `${TABLE_ALIAS}.content         AS content`,
        `${TABLE_ALIAS}.is_markdown     AS is_markdown`,
        `${TABLE_ALIAS}.icon            AS icon`,
        `${TABLE_ALIAS}.banner          AS banner`,
        `${TABLE_ALIAS}.splash          AS splash`,
        `${TABLE_ALIAS}.online          AS online`,
        `${TABLE_ALIAS}.member          AS member`,
        `${TABLE_ALIAS}.premium_tier    AS premium_tier`,
        `${TABLE_ALIAS}.link_type       AS link_type`,
        `${TABLE_ALIAS}.invite_code     AS invite_code`,
        `${TABLE_ALIAS}.membership_url  AS membership_url`,
        `${TABLE_ALIAS}.is_bot          AS is_bot`,
        `${TABLE_ALIAS}.is_open         AS is_open`,
        `${TABLE_ALIAS}.is_admin_open   AS is_admin_open`,
        `${TABLE_ALIAS}.private_reason  AS private_reason`,
        `${TABLE_ALIAS}.created_at      AS created_at`,
        `${TABLE_ALIAS}.updated_at      AS updated_at`,
        `${TABLE_ALIAS}.refresh_date    AS refresh_date`,
    ]);

    // JOIN
    qb.leftJoin('guild_admin_permission', 'admin', `admin.guild_id = ${TABLE_ALIAS}.id`);

    // WHERE
    qb.andWhere(`${TABLE_ALIAS}.id = :id`, { id });
    qb.andWhere(
        new Brackets((qb) => {
            qb.where(`${TABLE_ALIAS}.user_id = :user_id`, { user_id });
            qb.orWhere('admin.user_id = :user_id', { user_id });
        }),
    );

    return qb.getRawOne();
}
