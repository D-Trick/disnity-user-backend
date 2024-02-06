// types
import type { CFindOneOptions } from '@databases/types/guild.type';
// lib
import { Repository } from 'typeorm';
// utils
import { createEntityManager } from '@utils/database/create-entity-manager';
// entities
import { Guild } from '@databases/entities/guild.entity';

// ----------------------------------------------------------------------

export async function cFindOne(repository: Repository<Guild>, options: CFindOneOptions): Promise<Guild> {
    const { transaction, ...findOneOptions } = options || {};

    const em = createEntityManager<Guild>({
        repository,
        transaction,
    });

    return em.findOne(Guild, findOneOptions);
}
