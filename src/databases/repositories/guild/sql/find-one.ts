// types
import type { CFindOneOptions, ReturnCFindOne, SelectType } from '@databases/types/guild.type';
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
    content: true,
    is_markdown: true,
    icon: true,
    link_type: true,
    online: true,
    member: true,
    premium_tier: true,
    membership_url: true,

    created_at: true,
    updated_at: true,
    refresh_date: true,
};
// ----------------------------------------------------------------------

export async function cFindOne<T extends SelectType = 'basic'>(
    repository: Repository<Guild>,
    options: CFindOneOptions,
): Promise<ReturnCFindOne[T]> {
    const { transaction, preSelect, ...findOneOptions } = options || {};

    const em = createEntityManager<Guild>({
        repository,
        transaction,
    });

    if (preSelect?.frequentlyUsed) {
        findOneOptions.select = frequentlyUsed;
    }

    return em.findOne(Guild, findOneOptions);
}
