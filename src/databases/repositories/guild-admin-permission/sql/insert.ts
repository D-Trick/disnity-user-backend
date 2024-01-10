// types
import type { InsertResult } from 'typeorm';
import type { InsertOptions } from '@databases/types/guild-admin-permission.type';
// lib
import { Repository } from 'typeorm';
// utils
import { createInsertQueryBuilder } from '@utils/database/createQueryBuilder';
// alias
import { GUILD_ADMIN_PERMISSION_TABLE_ALIAS as TABLE_ALIAS } from '@databases/common/table-alias';
// entities
import { GuildAdminPermission } from '@databases/entities/guild-admin-permission.entity';

// ----------------------------------------------------------------------

export async function cInsert(
    repository: Repository<GuildAdminPermission>,
    options: InsertOptions,
): Promise<InsertResult> {
    const { transaction, values } = options || {};

    const qb = createInsertQueryBuilder<GuildAdminPermission>(GuildAdminPermission, TABLE_ALIAS, {
        repository,
        transaction,
    });

    qb.into(GuildAdminPermission).values(values);

    return qb.execute();
}
