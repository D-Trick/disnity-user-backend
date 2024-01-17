// types
import type { CFindOneOptions } from '@databases/types/guild-admin-permission.type';
// lib
import { Repository } from 'typeorm';
// utils
import { createEntityManager } from '@utils/database/createEntityManager';
// entities
import { GuildAdminPermission } from '@databases/entities/guild-admin-permission.entity';

// ----------------------------------------------------------------------

export async function cFindOne(
    repository: Repository<GuildAdminPermission>,
    options: CFindOneOptions,
): Promise<GuildAdminPermission> {
    const { transaction, ...findOneOptions } = options || {};

    const em = createEntityManager<GuildAdminPermission>({
        repository,
        transaction,
    });

    return em.findOne(GuildAdminPermission, findOneOptions);
}
