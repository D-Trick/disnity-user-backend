// types
import type { CFindOptions } from '@databases/types/tag.type';
// lib
import { Repository } from 'typeorm';
// utils
import { createEntityManager } from '@utils/database/createEntityManager';
// entities
import { Tag } from '@databases/entities/tag.entity';

// ----------------------------------------------------------------------

export async function cFind(repository: Repository<Tag>, options: CFindOptions): Promise<Tag[]> {
    const { transaction, ...findManyOptions } = options || {};

    const em = createEntityManager<Tag>({
        repository,
        transaction,
    });

    return em.find(Tag, findManyOptions);
}
