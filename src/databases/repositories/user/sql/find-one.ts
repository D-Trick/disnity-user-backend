// types
import type { CFindOneOptions } from '@databases/types/user.type';
// lib
import { Repository } from 'typeorm';
// utils
import { createEntityManager } from '@utils/database/createEntityManager';
// entities
import { User } from '@databases/entities/user.entity';

// ----------------------------------------------------------------------

export async function cFindOne(repository: Repository<User>, options: CFindOneOptions): Promise<User> {
    const { transaction, ...findOneOptions } = options || {};

    const em = createEntityManager<User>({
        repository,
        transaction,
    });

    return em.findOne(User, findOneOptions);
}
