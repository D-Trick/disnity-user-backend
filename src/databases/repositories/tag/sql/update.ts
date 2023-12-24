// types
import type { UpdateResult } from 'typeorm';
import type { UpdateOptions } from '@databases/types/tag.type';
// lib
import { Repository } from 'typeorm';
import { isAllEmpty } from '@utils/index';
// utils
import { createUpdateQueryBuilder } from '@databases/utils/createQueryBuilder';
// messages
import { COMMON_ERROR_MESSAGES } from '@common/messages';
// alias
import { TAG_TABLE_ALIAS as TABLE_ALIAS } from '@databases/common/table-alias';
// entities
import { Tag } from '@databases/entities/tag.entity';

// ----------------------------------------------------------------------

export async function cUpdate(repository: Repository<Tag>, options: UpdateOptions): Promise<UpdateResult> {
    const { transaction, values, where } = options || {};
    const { id, guild_id } = where || {};

    const checkValues = [id, guild_id];
    if (isAllEmpty(checkValues)) throw Error(COMMON_ERROR_MESSAGES.PRAMITER_REQUIRED);

    const qb = createUpdateQueryBuilder<Tag>(Tag, TABLE_ALIAS, {
        repository,
        transaction,
    });

    qb.set(values);

    // WHERE
    if (id) qb.andWhere('id = :id', { id });
    if (guild_id) qb.andWhere('guild_id = :guild_id', { guild_id });

    return qb.execute();
}
