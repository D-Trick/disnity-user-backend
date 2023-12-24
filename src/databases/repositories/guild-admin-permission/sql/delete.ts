// types
import type { DeleteResult } from 'typeorm';
import type { DeleteOptions } from '@databases/types/guild-admin-permission.type';
// lib
import { Repository } from 'typeorm';
// utils
import { isAllEmpty } from '@utils/index';
import { createDeleteQueryBuilder } from '@databases/utils/createQueryBuilder';
// messages
import { COMMON_ERROR_MESSAGES } from '@common/messages';
// alias
import { GUILD_ADMIN_PERMISSION_TABLE_ALIAS as TABLE_ALIAS } from '@databases/common/table-alias';
// entities
import { GuildAdminPermission } from '@databases/entities/guild-admin-permission.entity';

// ----------------------------------------------------------------------

export async function cDelete(
    repository: Repository<GuildAdminPermission>,
    options: DeleteOptions,
): Promise<DeleteResult> {
    const { transaction, where } = options || {};
    const { guild_id, user_id, IN } = where || {};
    const { user_ids } = IN || {};

    const checkValues = [guild_id, user_id, ...(user_ids || [])];
    if (isAllEmpty(checkValues)) throw Error(COMMON_ERROR_MESSAGES.PRAMITER_REQUIRED);

    const qb = createDeleteQueryBuilder<GuildAdminPermission>(GuildAdminPermission, TABLE_ALIAS, {
        repository,
        transaction,
    });

    // WHERE
    qb.where('guild_id = :guild_id', { guild_id });
    if (user_id) qb.andWhere('user_id = :user_id', { user_id });
    // IN
    if (user_ids) qb.andWhere('user_id IN (:user_ids)', { user_ids });

    return qb.execute();
}
