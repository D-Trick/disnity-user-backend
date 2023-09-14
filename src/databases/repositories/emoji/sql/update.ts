// types
import type { UpdateResult } from 'typeorm';
import type { UpdateOptions } from '@databases/types/emoji.type';
// lib
import { Repository } from 'typeorm';
// utils
import { isAllEmpty } from '@utils/index';
import { createUpdateQueryBuilder } from '@databases/utils/createQueryBuilder';
// messages
import { ERROR_MESSAGES } from '@common/messages';
// alias
import { EMOJI_TABLE_ALIAS as TABLE_ALIAS } from '@databases/common/table-alias';
// entities
import { Emoji } from '@databases/entities/emoji.entity';

// ----------------------------------------------------------------------

export async function cUpdate(repository: Repository<Emoji>, options: UpdateOptions): Promise<UpdateResult> {
    const { transaction, values, where } = options || {};
    const { id, guild_id } = where || {};

    const checkValues = [id, guild_id];
    if (isAllEmpty(checkValues)) throw Error(ERROR_MESSAGES.PRAMITER_REQUIRED);

    const qb = createUpdateQueryBuilder<Emoji>(Emoji, TABLE_ALIAS, {
        repository,
        transaction,
    });

    qb.set(values);

    // WHERE
    if (id) qb.andWhere('id = :id', { id });
    if (guild_id) qb.andWhere('guild_id = :guild_id', { guild_id });

    return qb.execute();
}
