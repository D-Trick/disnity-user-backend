// types
import type { Select } from '@databases/ts/types/user.type';
import type {
    BulkUpdateOptions,
    SelectOptions,
    InsertOptions,
    UpdateOptions,
} from '@databases/ts/interfaces/user.interface';
// lib
import { InsertResult, Repository, SelectQueryBuilder, UpdateResult } from 'typeorm';
import { bulkUpdateQueryFormat, isAllEmpty } from '@lib/utiles';
// utils
import {
    createInsertQueryBuilder,
    createSelectQueryBuilder,
    createUpdateQueryBuilder,
} from '@databases/utils/createQueryBuilder';
// messages
import { ERROR_MESSAGES } from '@common/messages';
// entities
import { User } from '@databases/entities/user.entity';
// repositorys
import { CustomRepository } from '@common/modules/typeorm-custom-repository.module';

// ----------------------------------------------------------------------
const TABLE_ALIAS = 'user';
// ----------------------------------------------------------------------
function select(qb: SelectQueryBuilder<User>, options: SelectOptions) {
    const { where } = options || {};
    const { id, IN } = where || {};
    const { ids } = IN || {};

    // select
    qb.select([
        'id',
        'global_name',
        'username',
        'discriminator',
        'email',
        'verified',
        'avatar',
        'locale',
        `DATE_FORMAT(created_at, '%Y-%m-%d %H:%i:%S') AS created_at`,
        `DATE_FORMAT(updated_at, '%Y-%m-%d %H:%i:%S') AS updated_at`,
    ]);

    // where
    if (id) qb.where('id = :id', { id });
    if (ids) qb.where('id IN (:ids)', { ids });

    return qb;
}
// ----------------------------------------------------------------------

@CustomRepository(User)
export class UserRepository extends Repository<User> {
    /**
     * user seelct - One
     * @param {SelectOptions} options
     */
    async selectOne(options: SelectOptions): Promise<Select> {
        const { transaction } = options || {};

        const qb = createSelectQueryBuilder<User>(User, TABLE_ALIAS, {
            repository: this,
            transaction,
        });

        return select(qb, options).getRawOne<Select>();
    }
    /**
     * user seelct - Many
     * @param {SelectOptions} options
     */
    async selectMany(options: SelectOptions): Promise<Select[]> {
        const { transaction } = options || {};

        const qb = createSelectQueryBuilder<User>(User, TABLE_ALIAS, {
            repository: this,
            transaction,
        });

        return select(qb, options).getRawMany<Select>();
    }

    /**
     * INSERT
     * @param {InsertOptions} options
     */
    async _insert(options: InsertOptions): Promise<InsertResult> {
        const { transaction, values } = options || {};

        const qb = createInsertQueryBuilder<User>(User, TABLE_ALIAS, {
            repository: this,
            transaction,
        });

        qb.into(User).values(values);

        return qb.execute();
    }

    /**
     * UPDATE
     * @param {UpdateOptions} options
     */
    async _update(options: UpdateOptions): Promise<UpdateResult> {
        const { transaction, values, where } = options || {};
        const { id } = where || {};

        const checkValues = [id];
        if (isAllEmpty(checkValues)) throw Error(ERROR_MESSAGES.PRAMITER_REQUIRED);

        const qb = createUpdateQueryBuilder<User>(User, TABLE_ALIAS, {
            repository: this,
            transaction,
        });

        qb.set(values);

        // WHERE
        qb.where('id = :id', { id });

        return qb.execute();
    }

    /**
     * BULK UPDATE
     * @param {BulkUpdateOptions} options
     */
    async bulkUpdate(options: BulkUpdateOptions): Promise<UpdateResult> {
        const { transaction, values, where } = options || {};
        const { IN } = where || {};
        const { ids } = IN || {};

        const bulkValues = bulkUpdateQueryFormat(ids, values);

        const qb = createUpdateQueryBuilder<User>(User, TABLE_ALIAS, {
            repository: this,
            transaction,
        });

        qb.set(bulkValues);

        // WHERE
        qb.where('id IN (:ids)', { ids });

        return qb.execute();
    }
}
