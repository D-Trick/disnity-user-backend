// types
import type { UpdateResult } from 'typeorm';
import type { UpdateOptions } from '@databases/types/guild-admin-permission.type';
// lib
import { Repository } from 'typeorm';
import { isAllEmpty } from '@utils/index';
// utils
import { createUpdateQueryBuilder } from '@databases/utils/createQueryBuilder';
// messages
import { COMMON_ERROR_MESSAGES } from '@common/messages';
// alias
import { GUILD_ADMIN_PERMISSION_TABLE_ALIAS as TABLE_ALIAS } from '@databases/common/table-alias';
// entities
import { GuildAdminPermission } from '@databases/entities/guild-admin-permission.entity';

// ----------------------------------------------------------------------

export async function cUpdate(
    repository: Repository<GuildAdminPermission>,
    options: UpdateOptions,
): Promise<UpdateResult> {
    const { transaction, values, where } = options;
    const { guild_id, user_id } = where || {};

    const checkValues = [guild_id, user_id];
    if (isAllEmpty(checkValues)) throw Error(COMMON_ERROR_MESSAGES.PRAMITER_REQUIRED);

    const qb = createUpdateQueryBuilder<GuildAdminPermission>(GuildAdminPermission, TABLE_ALIAS, {
        repository,
        transaction,
    });

    qb.set(values);

    // WHERE
    qb.where('guild_id = :guild_id', { guild_id });
    qb.andWhere('user_id = :user_id', { user_id });

    return qb.execute();
}
