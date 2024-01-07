// types
import type { CFindOneOptions } from '@databases/types/emoji.type';
// lib
import { Repository } from 'typeorm';
// utils
import { createEntityManager } from '@databases/utils/createEntityManager';
// entities
import { Emoji } from '@databases/entities/emoji.entity';

// ----------------------------------------------------------------------

export async function cFindOne(repository: Repository<Emoji>, options: CFindOneOptions): Promise<Emoji> {
    const { transaction, ...findOneOptions } = options || {};

    const em = createEntityManager<Emoji>({
        repository,
        transaction,
    });

    return em.findOne(Emoji, findOneOptions);
}
