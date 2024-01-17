// types
import type { CFindOptions } from '@databases/types/guild.type';
// lib
import { Repository } from 'typeorm';
// utils
import { createEntityManager } from '@utils/database/createEntityManager';
// entities
import { Guild } from '@databases/entities/guild.entity';

// ----------------------------------------------------------------------

export async function cFind(repository: Repository<Guild>, options: CFindOptions): Promise<Guild[]> {
    const { transaction, ...findManyOptions } = options || {};

    const em = createEntityManager<Guild>({
        repository,
        transaction,
    });

    return em.find(Guild, findManyOptions);
}
