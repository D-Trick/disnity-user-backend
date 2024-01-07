// types
import type { CFindOptions } from '@databases/types/guild-admin-permission.type';
// lib
import { Repository } from 'typeorm';
// utils
import { createEntityManager } from '@databases/utils/createEntityManager';
// entities
import { GuildAdminPermission } from '@databases/entities/guild-admin-permission.entity';

// ----------------------------------------------------------------------

export async function cFind(
    repository: Repository<GuildAdminPermission>,
    options: CFindOptions,
): Promise<GuildAdminPermission[]> {
    const { transaction, ...findManyOptions } = options || {};

    const em = createEntityManager<GuildAdminPermission>({
        repository,
        transaction,
    });

    return em.find(GuildAdminPermission, findManyOptions);
}
