// types
import type { InsertResult } from 'typeorm';
import type { InsertOptions } from '@databases/types/user.type';
// lib
import { Repository } from 'typeorm';
// utils
import { createInsertQueryBuilder } from '@databases/utils/createQueryBuilder';
// alias
import { USER_TABLE_ALIAS as TABLE_ALIAS } from '@databases/common/table-alias';
// entities
import { User } from '@databases/entities/user.entity';

// ----------------------------------------------------------------------

export async function cInsert(repository: Repository<User>, options: InsertOptions): Promise<InsertResult> {
    const { transaction, values } = options || {};

    const qb = createInsertQueryBuilder<User>(User, TABLE_ALIAS, {
        repository,
        transaction,
    });

    qb.into(User).values(values);

    return qb.execute();
}
