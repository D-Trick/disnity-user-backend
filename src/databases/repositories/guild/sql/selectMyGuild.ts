// types
import type { SelectQueryBuilder } from 'typeorm';
import type { SelectMyGuildOptions } from '@databases/types/guild.type';
// lib
import { Brackets, Repository } from 'typeorm';
// utils
import { createSelectQueryBuilder } from '@utils/database/createQueryBuilder';
// alias
import { GUILD_TABLE_ALIAS as TABLE_ALIAS } from '@databases/common/table-alias';
// entities
import { Guild } from '@databases/entities/guild.entity';

// ----------------------------------------------------------------------
function getSelectColumns(columns: SelectMyGuildOptions['select']['columns']) {
    const selectColumns = [];

    if (columns?.id) {
        selectColumns.push(`${TABLE_ALIAS}.id AS id`);
    }
    if (columns?.user_id) {
        selectColumns.push(`${TABLE_ALIAS}.user_id AS user_id`);
    }
    if (columns?.category_id) {
        selectColumns.push(`${TABLE_ALIAS}.category_id AS category_id`);
    }
    if (columns?.name) {
        selectColumns.push(`${TABLE_ALIAS}.name AS name`);
    }
    if (columns?.summary) {
        selectColumns.push(`${TABLE_ALIAS}.summary AS summary`);
    }
    if (columns?.content) {
        selectColumns.push(`${TABLE_ALIAS}.content AS content`);
    }
    if (columns?.is_markdown) {
        selectColumns.push(`${TABLE_ALIAS}.is_markdown AS is_markdown`);
    }
    if (columns?.icon) {
        selectColumns.push(`${TABLE_ALIAS}.icon AS icon`);
    }
    if (columns?.banner) {
        selectColumns.push(`${TABLE_ALIAS}.banner AS banner`);
    }
    if (columns?.splash) {
        selectColumns.push(`${TABLE_ALIAS}.splash AS splash`);
    }
    if (columns?.online) {
        selectColumns.push(`${TABLE_ALIAS}.online AS online`);
    }
    if (columns?.member) {
        selectColumns.push(`${TABLE_ALIAS}.member AS member`);
    }
    if (columns?.premium_tier) {
        selectColumns.push(`${TABLE_ALIAS}.premium_tier AS premium_tier`);
    }
    if (columns?.link_type) {
        selectColumns.push(`${TABLE_ALIAS}.link_type AS link_type`);
    }
    if (columns?.invite_code) {
        selectColumns.push(`${TABLE_ALIAS}.invite_code AS invite_code`);
    }
    if (columns?.membership_url) {
        selectColumns.push(`${TABLE_ALIAS}.membership_url AS membership_url`);
    }
    if (columns?.is_bot) {
        selectColumns.push(`${TABLE_ALIAS}.is_bot AS is_bot`);
    }
    if (columns?.is_open) {
        selectColumns.push(`${TABLE_ALIAS}.is_open AS is_open`);
    }
    if (columns?.is_admin_open) {
        selectColumns.push(`${TABLE_ALIAS}.is_admin_open AS is_admin_open`);
    }
    if (columns?.private_reason) {
        selectColumns.push(`${TABLE_ALIAS}.private_reason AS private_reason`);
    }
    if (columns?.created_at) {
        selectColumns.push(`DATE_FORMAT(${TABLE_ALIAS}.created_at, '%Y-%m-%d %H:%i:%S') AS created_at`);
    }
    if (columns?.updated_at) {
        selectColumns.push(`DATE_FORMAT(${TABLE_ALIAS}.updated_at, '%Y-%m-%d %H:%i:%S') AS updated_at`);
    }
    if (columns?.refresh_date) {
        selectColumns.push(`DATE_FORMAT(${TABLE_ALIAS}.refresh_date, '%Y-%m-%d %H:%i:%S')        AS refresh_date`);
    }

    return selectColumns;
}
// ----------------------------------------------------------------------
function selectMyGuild(qb: SelectQueryBuilder<Guild>, options: SelectMyGuildOptions) {
    const { select: exclusiveSelect, where } = options || {};
    const { columns } = exclusiveSelect || {};
    const { id, user_id } = where || {};

    // SELECT
    if (columns) {
        const selectColumns = getSelectColumns(columns);

        qb.select(selectColumns);
    } else {
        throw new Error('[guild/select] Select option Empty');
    }

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

    return qb;
}
// ----------------------------------------------------------------------

export async function selectMyGuildOne(
    repository: Repository<Guild>,
    options: SelectMyGuildOptions,
): Promise<Partial<Guild>> {
    const { transaction } = options || {};

    const qb = createSelectQueryBuilder<Guild>(Guild, TABLE_ALIAS, {
        repository,
        transaction,
    });

    return selectMyGuild(qb, options).getRawOne();
}
