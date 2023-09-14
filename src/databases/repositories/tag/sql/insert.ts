// types
import type { InsertResult } from 'typeorm';
import type { InsertOptions } from '@databases/types/tag.type';
// lib
import { Repository } from 'typeorm';
// utils
import { createInsertQueryBuilder } from '@databases/utils/createQueryBuilder';
// alias
import { TAG_TABLE_ALIAS as TABLE_ALIAS } from '@databases/common/table-alias';
// entities
import { Tag } from '@databases/entities/tag.entity';

// ----------------------------------------------------------------------

export async function cInsert(repository: Repository<Tag>, options: InsertOptions): Promise<InsertResult> {
    const { transaction, values } = options || {};

    const qb = createInsertQueryBuilder<Tag>(Tag, TABLE_ALIAS, {
        repository,
        transaction,
    });

    qb.into(Tag).values(values);

    return qb.execute();
}
