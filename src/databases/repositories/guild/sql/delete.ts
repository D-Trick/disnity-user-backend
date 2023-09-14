// types
import type { DeleteResult } from 'typeorm';
import type { DeleteOptions } from '@databases/types/guild.type';
// lib
import { Repository } from 'typeorm';
// utils
import { isAllEmpty } from '@utils/index';
import { createDeleteQueryBuilder } from '@databases/utils/createQueryBuilder';
// messages
import { ERROR_MESSAGES } from '@common/messages';
// alias
import { GUILD_TABLE_ALIAS as TABLE_ALIAS } from '@databases/common/table-alias';
// entities
import { Guild } from '@databases/entities/guild.entity';

// ----------------------------------------------------------------------

export async function cDelete(repository: Repository<Guild>, options: DeleteOptions): Promise<DeleteResult> {
    const { transaction, where } = options || {};
    const { id, user_id } = where || {};

    const checkValues = [id, user_id];
    if (isAllEmpty(checkValues)) throw Error(ERROR_MESSAGES.PRAMITER_REQUIRED);

    const qb = createDeleteQueryBuilder<Guild>(Guild, TABLE_ALIAS, {
        repository,
        transaction,
    });

    // WHERE
    if (id) qb.andWhere('id = :id', { id });
    if (user_id) qb.andWhere('user_id = :user_id', { user_id });

    return qb.execute();
}
