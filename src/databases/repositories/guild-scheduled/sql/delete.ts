// types
import type { DeleteResult } from 'typeorm';
import type { DeleteOptions } from '@databases/types/guild-scheduled.type';
// lib
import { Repository } from 'typeorm';
// utils
import { isAllEmpty } from '@utils/index';
import { createDeleteQueryBuilder } from '@databases/utils/createQueryBuilder';
// messages
import { COMMON_ERROR_MESSAGES } from '@common/messages';
// alias
import { GUILD_SCHEDULED_TABLE_ALIAS as TABLE_ALIAS } from '@databases/common/table-alias';
// entities
import { GuildScheduled } from '@databases/entities/guild-scheduled.entity';

// ----------------------------------------------------------------------

export async function cDelete(repository: Repository<GuildScheduled>, options: DeleteOptions): Promise<DeleteResult> {
    const { transaction, where } = options || {};
    const { id, guild_id } = where || {};

    const checkValues = [id, guild_id];
    if (isAllEmpty(checkValues)) throw Error(COMMON_ERROR_MESSAGES.PRAMITER_REQUIRED);

    const qb = createDeleteQueryBuilder<GuildScheduled>(GuildScheduled, TABLE_ALIAS, {
        repository,
        transaction,
    });

    // WHERE
    if (id) qb.andWhere('id = :id', { id });
    if (guild_id) qb.andWhere('guild_id = :guild_id', { guild_id });

    return qb.execute();
}
