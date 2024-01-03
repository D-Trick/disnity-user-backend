// types
import type { CFindOptions } from '@databases/types/common-code.type';
// lib
import { Repository } from 'typeorm';
// utils
import { createEntityManager } from '@databases/utils/createEntityManager';
// entities
import { CommonCode } from '@databases/entities/common-code.entity';

// ----------------------------------------------------------------------

export async function cFind(repository: Repository<CommonCode>, options: CFindOptions): Promise<CommonCode[]> {
    const { transaction, ...findManyOptions } = options || {};

    const em = createEntityManager<CommonCode>({
        repository,
        transaction,
    });

    return em.find(CommonCode, findManyOptions);
}
