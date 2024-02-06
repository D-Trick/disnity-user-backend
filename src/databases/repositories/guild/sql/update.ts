// types
import type { UpdateResult } from 'typeorm';
import type { UpdateOptions } from '@databases/types/guild.type';
// lib
import { Repository } from 'typeorm';
import { isAllEmpty } from '@utils/index';
// utils
import { createUpdateQueryBuilder } from '@utils/database/create-query-builder';
// messages
import { COMMON_ERROR_MESSAGES } from '@common/messages';
// alias
import { GUILD_TABLE_ALIAS as TABLE_ALIAS } from '@databases/common/table-alias';
// entities
import { Guild } from '@databases/entities/guild.entity';

// ----------------------------------------------------------------------

export async function cUpdate(repository: Repository<Guild>, options: UpdateOptions): Promise<UpdateResult> {
    const { transaction, values, where } = options || {};
    const { id, user_id } = where || {};

    const checkValues = [id, user_id];
    if (isAllEmpty(checkValues)) throw Error(COMMON_ERROR_MESSAGES.PRAMITER_REQUIRED);

    const qb = createUpdateQueryBuilder<Guild>(Guild, TABLE_ALIAS, {
        repository,
        transaction,
    });

    qb.set(values);

    // WHERE
    if (id) qb.andWhere('id = :id', { id });
    if (user_id) qb.andWhere('user_id = :user_id', { user_id });

    return qb.execute();
}
