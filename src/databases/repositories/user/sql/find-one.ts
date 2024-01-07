// types
import type { CFindOneOptions, ReturnCFindOne, SelectType } from '@databases/types/user.type';
// lib
import { Repository } from 'typeorm';
// utils
import { createEntityManager } from '@databases/utils/createEntityManager';
// entities
import { User } from '@databases/entities/user.entity';

// ----------------------------------------------------------------------
const frequentlyUsed = {
    id: true,
    global_name: true,
    username: true,
    discriminator: true,
    email: true,
    verified: true,
    avatar: true,
    locale: true,
    created_at: true,
    updated_at: true,
};
// ----------------------------------------------------------------------

export async function cFindOne<T extends SelectType = 'basic'>(
    repository: Repository<User>,
    options: CFindOneOptions,
): Promise<ReturnCFindOne[T]> {
    const { transaction, preSelect, ...findOneOptions } = options || {};

    const em = createEntityManager<User>({
        repository,
        transaction,
    });

    if (preSelect?.frequentlyUsed) {
        findOneOptions.select = frequentlyUsed;
    }

    return em.findOne(User, findOneOptions);
}
