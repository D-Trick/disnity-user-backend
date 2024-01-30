// types
import type { CFindOptions } from '@databases/types/user.type';
// lib
import { Repository } from 'typeorm';
// utils
import { createEntityManager } from '@utils/database/create-entity-manager';
// entities
import { User } from '@databases/entities/user.entity';

// ----------------------------------------------------------------------

export async function cFind(repository: Repository<User>, options: CFindOptions): Promise<User[]> {
    const { transaction, ...findManyOptions } = options || {};

    const em = createEntityManager<User>({
        repository,
        transaction,
    });

    return em.find(User, findManyOptions);
}
