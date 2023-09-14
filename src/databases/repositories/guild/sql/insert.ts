// types
import type { InsertResult } from 'typeorm';
import type { InsertOptions } from '@databases/types/guild.type';
// lib
import { Repository } from 'typeorm';
// utils
import { createInsertQueryBuilder } from '@databases/utils/createQueryBuilder';
// alias
import { GUILD_TABLE_ALIAS as TABLE_ALIAS } from '@databases/common/table-alias';
// entities
import { Guild } from '@databases/entities/guild.entity';

// ----------------------------------------------------------------------

export async function cInsert(repository: Repository<Guild>, options: InsertOptions): Promise<InsertResult> {
    const { transaction, values } = options || {};

    const qb = createInsertQueryBuilder<Guild>(Guild, TABLE_ALIAS, {
        repository,
        transaction,
    });

    qb.into(Guild).values(values);

    return qb.execute();
}
