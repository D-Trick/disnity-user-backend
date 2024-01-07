// types
import type { CFindOptions, ReturnCFind, SelectType } from '@databases/types/guild.type';
// lib
import { Repository } from 'typeorm';
// utils
import { createEntityManager } from '@databases/utils/createEntityManager';
// entities
import { Guild } from '@databases/entities/guild.entity';

// ----------------------------------------------------------------------
const frequentlyUsed = {
    id: true,
    name: true,
    summary: true,
    icon: true,
    link_type: true,
    online: true,
    member: true,
    membership_url: true,
    refresh_date: true,
};
// ----------------------------------------------------------------------

export async function cFind<T extends SelectType = 'basic'>(
    repository: Repository<Guild>,
    options: CFindOptions,
): Promise<ReturnCFind[T]> {
    const { transaction, preSelect, ...findManyOptions } = options || {};

    const em = createEntityManager<Guild>({
        repository,
        transaction,
    });

    if (preSelect?.frequentlyUsed) {
        findManyOptions.select = frequentlyUsed;
    }

    return em.find(Guild, findManyOptions);
}
