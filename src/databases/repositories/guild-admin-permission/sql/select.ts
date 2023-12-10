// types
import type { SelectQueryBuilder } from 'typeorm';
import type { SelectOptions } from '@databases/types/guild-admin-permission.type';
// lib
import { Repository } from 'typeorm';
// utils
import { createSelectQueryBuilder } from '@databases/utils/createQueryBuilder';
// alias
import { GUILD_ADMIN_PERMISSION_TABLE_ALIAS as TABLE_ALIAS } from '@databases/common/table-alias';
// entities
import { GuildAdminPermission } from '@databases/entities/guild-admin-permission.entity';

// ----------------------------------------------------------------------
function getSelectColumns(columns: SelectOptions['select']['columns']) {
    const selectColumns = [];

    if (columns?.id) {
        selectColumns.push(`id`);
    }
    if (columns?.guild_id) {
        selectColumns.push(`guild_id`);
    }
    if (columns?.user_id) {
        selectColumns.push(`user_id`);
    }
    if (columns?.is_owner) {
        selectColumns.push(`is_owner`);
    }

    return selectColumns;
}
// ----------------------------------------------------------------------
function select(qb: SelectQueryBuilder<GuildAdminPermission>, options: SelectOptions) {
    const { select: exclusiveSelect, where } = options || {};
    const { columns } = exclusiveSelect || {};
    const { guild_id, user_id } = where || {};

    // SELECT
    if (columns) {
        const selectColumns = getSelectColumns(columns);

        qb.select(selectColumns);
    } else {
        throw new Error('[guildAdminPermission/select] Select option Empty');
    }

    // WHERE
    if (guild_id) qb.andWhere('guild_id = :guild_id', { guild_id });
    if (user_id) qb.andWhere('user_id = :user_id', { user_id });

    return qb;
}
// ----------------------------------------------------------------------

export async function selectOne(
    repository: Repository<GuildAdminPermission>,
    options: SelectOptions,
): Promise<Partial<GuildAdminPermission>> {
    const { transaction } = options || {};

    const qb = createSelectQueryBuilder<GuildAdminPermission>(GuildAdminPermission, TABLE_ALIAS, {
        repository,
        transaction,
    });

    return select(qb, options).getRawOne();
}

export async function selectMany(
    repository: Repository<GuildAdminPermission>,
    options: SelectOptions,
): Promise<Partial<GuildAdminPermission>[]> {
    const { transaction } = options || {};

    const qb = createSelectQueryBuilder<GuildAdminPermission>(GuildAdminPermission, TABLE_ALIAS, {
        repository,
        transaction,
    });

    return select(qb, options).getRawMany();
}
