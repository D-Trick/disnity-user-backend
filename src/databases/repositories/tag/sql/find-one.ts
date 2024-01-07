// types
import type { CFindOneOptions } from '@databases/types/tag.type';
// lib
import { Repository } from 'typeorm';
// utils
import { createEntityManager } from '@databases/utils/createEntityManager';
// entities
import { Tag } from '@databases/entities/tag.entity';

// ----------------------------------------------------------------------

export async function cFindOne(repository: Repository<Tag>, options: CFindOneOptions): Promise<Tag> {
    const { transaction, ...findOneOptions } = options || {};

    const em = createEntityManager<Tag>({
        repository,
        transaction,
    });

    return em.findOne(Tag, findOneOptions);
}
