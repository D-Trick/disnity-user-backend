// types
import type { CFindOneOptions } from '@databases/types/guild-scheduled.type';
// lib
import { Repository } from 'typeorm';
// utils
import { createEntityManager } from '@utils/database/create-entity-manager';
// entities
import { GuildScheduled } from '@databases/entities/guild-scheduled.entity';

// ----------------------------------------------------------------------

export async function cFindOne(
    repository: Repository<GuildScheduled>,
    options: CFindOneOptions,
): Promise<GuildScheduled> {
    const { transaction, ...findOneOptions } = options || {};

    const em = createEntityManager<GuildScheduled>({
        repository,
        transaction,
    });

    return em.findOne(GuildScheduled, findOneOptions);
}
