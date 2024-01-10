// types
import type { UpdateResult } from 'typeorm';
import type { BulkUpdateOptions } from '@databases/types/guild.type';
// lib
import { Repository } from 'typeorm';
// utils
import { bulkUpdateQueryFormat, createUpdateQueryBuilder } from '@utils/database';
// alias
import { GUILD_TABLE_ALIAS as TABLE_ALIAS } from '@databases/common/table-alias';
// entities
import { Guild } from '@databases/entities/guild.entity';

// ----------------------------------------------------------------------

export async function cBulkUpdate(repository: Repository<Guild>, options: BulkUpdateOptions): Promise<UpdateResult> {
    const { transaction, values, where } = options || {};
    const { IN } = where || {};
    const { ids } = IN || {};

    const { bulkValues, bulkParameters } = bulkUpdateQueryFormat(ids, values);

    const qb = createUpdateQueryBuilder<Guild>(Guild, TABLE_ALIAS, {
        repository,
        transaction,
    });

    qb.set(bulkValues);

    // WHERE
    qb.where('id IN (:ids)');

    return qb.setParameters({ ...bulkParameters, ids }).execute();
}
