// types
import type { InsertResult } from 'typeorm';
import type { InsertOptions } from '@databases/types/guild-scheduled.type';
// lib
import { Repository } from 'typeorm';
// utils
import { createInsertQueryBuilder } from '@databases/utils/createQueryBuilder';
// alias
import { GUILD_SCHEDULED_TABLE_ALIAS as TABLE_ALIAS } from '@databases/common/table-alias';
// entities
import { GuildScheduled } from '@databases/entities/guild-scheduled.entity';

// ----------------------------------------------------------------------

export async function cInsert(repository: Repository<GuildScheduled>, options: InsertOptions): Promise<InsertResult> {
    const { transaction, values } = options || {};

    const qb = createInsertQueryBuilder<GuildScheduled>(GuildScheduled, TABLE_ALIAS, {
        repository,
        transaction,
    });

    qb.into(GuildScheduled).values(values);

    return qb.execute();
}
