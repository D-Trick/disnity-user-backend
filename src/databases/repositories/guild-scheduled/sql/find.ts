// types
import type { CFindOptions } from '@databases/types/guild-scheduled.type';
// lib
import { Repository } from 'typeorm';
// utils
import { createEntityManager } from '@utils/database/createEntityManager';
// entities
import { GuildScheduled } from '@databases/entities/guild-scheduled.entity';

// ----------------------------------------------------------------------

export async function cFind(repository: Repository<GuildScheduled>, options: CFindOptions): Promise<GuildScheduled[]> {
    const { transaction, ...findManyOptions } = options || {};

    const em = createEntityManager<GuildScheduled>({
        repository,
        transaction,
    });

    return em.find(GuildScheduled, findManyOptions);
}
