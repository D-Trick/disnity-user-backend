// types
import type { DeleteResult, InsertResult, SelectQueryBuilder, UpdateResult } from 'typeorm';
import type { Select } from '@databases/ts/types/emoji.type';
import type {
    SelectOptions,
    InsertOptions,
    UpdateOptions,
    DeleteOptions,
} from '@databases/ts/interfaces/emoji.interface';
// lib
import { Repository } from 'typeorm';
import { isAllEmpty } from '@lib/utiles';
import {
    createDeleteQueryBuilder,
    createInsertQueryBuilder,
    createSelectQueryBuilder,
    createUpdateQueryBuilder,
} from '@databases/utils/createQueryBuilder';
// messages
import { ERROR_MESSAGES } from '@common/messages';
// entities
import { Emoji } from '@databases/entities/emoji.entity';
// repositorys
import { CustomRepository } from '@common/modules/typeorm-custom-repository.module';

// ----------------------------------------------------------------------
const TABLE_ALIAS = 'emoji';
// ----------------------------------------------------------------------
function select(qb: SelectQueryBuilder<Emoji>, options: SelectOptions) {
    const { where } = options || {};
    const { guild_id, animated } = where || {};

    // SELECT
    qb.select(['id', 'name']);

    // WHERE
    qb.where('guild_id = :guild_id', { guild_id });
    qb.andWhere('animated = :animated', { animated });

    return qb;
}
// ----------------------------------------------------------------------

@CustomRepository(Emoji)
export class EmojiRepository extends Repository<Emoji> {
    /**
     * 이모지 조회 - One
     * @param {SelectOptions} options
     */
    async selectOne(options: SelectOptions): Promise<Select> {
        const { transaction } = options || {};

        const qb = createSelectQueryBuilder<Emoji>(Emoji, TABLE_ALIAS, {
            repository: this,
            transaction,
        });

        return select(qb, options).getRawOne<Select>();
    }
    /**
     * 이모지 조회 - Many
     * @param {SelectOptions} options
     */
    async selectMany(options: SelectOptions): Promise<Select[]> {
        const { transaction } = options || {};

        const qb = createSelectQueryBuilder<Emoji>(Emoji, TABLE_ALIAS, {
            repository: this,
            transaction,
        });

        return select(qb, options).getRawMany<Select>();
    }

    async _insert(options: InsertOptions): Promise<InsertResult> {
        const { transaction, values } = options || {};

        const qb = createInsertQueryBuilder<Emoji>(Emoji, TABLE_ALIAS, {
            repository: this,
            transaction,
        });

        qb.into(Emoji).values(values);

        return qb.execute();
    }

    async _update(options: UpdateOptions): Promise<UpdateResult> {
        const { transaction, values, where } = options || {};
        const { id, guild_id } = where || {};

        const checkValues = [id, guild_id];
        if (isAllEmpty(checkValues)) throw Error(ERROR_MESSAGES.PRAMITER_REQUIRED);

        const qb = createUpdateQueryBuilder<Emoji>(Emoji, TABLE_ALIAS, {
            repository: this,
            transaction,
        });

        qb.set(values);

        // WHERE
        if (id) qb.andWhere('id = :id', { id });
        if (guild_id) qb.andWhere('guild_id = :guild_id', { guild_id });

        return qb.execute();
    }

    async _delete(options: DeleteOptions): Promise<DeleteResult> {
        const { transaction, where } = options || {};
        const { id, guild_id } = where || {};

        const checkValues = [id, guild_id];
        if (isAllEmpty(checkValues)) throw Error(ERROR_MESSAGES.PRAMITER_REQUIRED);

        const qb = createDeleteQueryBuilder<Emoji>(Emoji, TABLE_ALIAS, {
            repository: this,
            transaction,
        });

        // WHERE
        if (id) qb.andWhere('id = :id', { id });
        if (guild_id) qb.andWhere('guild_id = :guild_id', { guild_id });

        return qb.execute();
    }
}
