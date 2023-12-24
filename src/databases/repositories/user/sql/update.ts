// types
import type { UpdateResult } from 'typeorm';
import type { UpdateOptions } from '@databases/types/user.type';
// lib
import { Repository } from 'typeorm';
// utils
import { isAllEmpty } from '@utils/index';
import { createUpdateQueryBuilder } from '@databases/utils/createQueryBuilder';
// messages
import { COMMON_ERROR_MESSAGES } from '@common/messages';
// alias
import { USER_TABLE_ALIAS as TABLE_ALIAS } from '@databases/common/table-alias';
// entities
import { User } from '@databases/entities/user.entity';

// ----------------------------------------------------------------------

export async function cUpdate(repository: Repository<User>, options: UpdateOptions): Promise<UpdateResult> {
    const { transaction, values, where } = options || {};
    const { id } = where || {};

    const checkValues = [id];
    if (isAllEmpty(checkValues)) throw Error(COMMON_ERROR_MESSAGES.PRAMITER_REQUIRED);

    const qb = createUpdateQueryBuilder<User>(User, TABLE_ALIAS, {
        repository,
        transaction,
    });

    qb.set(values);

    // WHERE
    qb.where('id = :id', { id });

    return qb.execute();
}
