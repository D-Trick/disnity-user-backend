// types
import type { CFindOneOptions } from '@databases/types/common-code.type';
// lib
import { Repository } from 'typeorm';
// utils
import { createEntityManager } from '@utils/database/create-entity-manager';
// entities
import { CommonCode } from '@databases/entities/common-code.entity';

// ----------------------------------------------------------------------

export async function cFindOne(repository: Repository<CommonCode>, options: CFindOneOptions): Promise<CommonCode> {
    const { transaction, ...findManyOptions } = options || {};

    const em = createEntityManager<CommonCode>({
        repository,
        transaction,
    });

    return em.findOne(CommonCode, findManyOptions);
}
