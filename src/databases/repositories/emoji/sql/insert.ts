// types
import type { InsertResult } from 'typeorm';
import type { InsertOptions } from '@databases/types/emoji.type';
// lib
import { Repository } from 'typeorm';
// utils
import { createInsertQueryBuilder } from '@utils/database/createQueryBuilder';
// alias
import { EMOJI_TABLE_ALIAS as TABLE_ALIAS } from '@databases/common/table-alias';
// entities
import { Emoji } from '@databases/entities/emoji.entity';

// ----------------------------------------------------------------------

export async function cInsert(repository: Repository<Emoji>, options: InsertOptions): Promise<InsertResult> {
    const { transaction, values } = options || {};

    const qb = createInsertQueryBuilder<Emoji>(Emoji, TABLE_ALIAS, {
        repository,
        transaction,
    });

    qb.into(Emoji).values(values);

    return qb.execute();
}
