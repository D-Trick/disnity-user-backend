// types
import type { CFindOptions } from '@databases/types/emoji.type';
// lib
import { Repository } from 'typeorm';
// utils
import { createEntityManager } from '@utils/database/createEntityManager';
// entities
import { Emoji } from '@databases/entities/emoji.entity';

// ----------------------------------------------------------------------

export async function cFind(repository: Repository<Emoji>, options: CFindOptions): Promise<Emoji[]> {
    const { transaction, ...findManyOptions } = options || {};

    const em = createEntityManager<Emoji>({
        repository,
        transaction,
    });

    return em.find(Emoji, findManyOptions);
}
