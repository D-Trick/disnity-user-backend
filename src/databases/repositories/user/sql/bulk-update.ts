// types
import type { UpdateResult } from 'typeorm';
import type { BulkUpdateOptions } from '@databases/types/user.type';
// lib
import { Repository } from 'typeorm';
// utils
import { bulkUpdateQueryFormat, createUpdateQueryBuilder } from '@utils/database';
// alias
import { USER_TABLE_ALIAS as TABLE_ALIAS } from '@databases/common/table-alias';
// entities
import { User } from '@databases/entities/user.entity';

// ----------------------------------------------------------------------

export async function cBulkUpdate(repository: Repository<User>, options: BulkUpdateOptions): Promise<UpdateResult> {
    const { transaction, values, where } = options || {};
    const { IN } = where || {};
    const { ids } = IN || {};

    const { bulkValues, bulkParameters } = bulkUpdateQueryFormat(ids, values);

    const qb = createUpdateQueryBuilder<User>(User, TABLE_ALIAS, {
        repository,
        transaction,
    });

    qb.set(bulkValues);

    // WHERE
    qb.where('id IN (:ids)');

    return qb.setParameters({ ...bulkParameters, ids }).execute();
}
