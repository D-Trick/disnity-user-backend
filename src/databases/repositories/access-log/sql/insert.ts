// types
import type { InsertResult } from 'typeorm';
import type { InsertOptions } from '@databases/types/access-log.type';
// lib
import { Repository } from 'typeorm';
// utils
import { createInsertQueryBuilder } from '@utils/database/createQueryBuilder';
// alias
import { ACCESS_LOG_ALIAS as TABLE_ALIAS } from '@databases/common/table-alias';
// entities
import { AccessLog } from '@databases/entities/access-log.entity';

// ----------------------------------------------------------------------

export async function cInsert(repository: Repository<AccessLog>, options: InsertOptions): Promise<InsertResult> {
    const { transaction, values } = options || {};

    const qb = createInsertQueryBuilder<AccessLog>(AccessLog, TABLE_ALIAS, {
        repository,
        transaction,
    });

    qb.into(AccessLog).values(values);

    return qb.execute();
}
