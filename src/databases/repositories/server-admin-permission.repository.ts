// types
import type { DeleteResult, InsertResult, SelectQueryBuilder, UpdateResult } from 'typeorm';
import type { Select } from '@databases/ts/types/server-admin-permission.type';
import type {
    FindDetail,
    SelectOptions,
    InsertOptions,
    UpdateOptions,
    DeleteOptions,
} from '@databases/ts/interfaces/server-admin-permission.interface';
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
import { ServerAdminPermission } from '@databases/entities/server-admin-permission.entity';
// repositorys
import { CustomRepository } from '@common/modules/typeorm-custom-repository.module';

// ----------------------------------------------------------------------
const TABLE_ALIAS = 'admin';
// ----------------------------------------------------------------------
function select(qb: SelectQueryBuilder<ServerAdminPermission>, options: SelectOptions) {
    const { where } = options || {};
    const { guild_id, user_id } = where || {};

    // SELECt
    qb.select(['id', 'guild_id', 'user_id']);

    // WHERE
    if (guild_id) qb.andWhere('guild_id = :guild_id', { guild_id });
    if (user_id) qb.andWhere('user_id = :user_id', { user_id });

    return qb;
}
// ----------------------------------------------------------------------

@CustomRepository(ServerAdminPermission)
export class ServerAdminPermissionRepository extends Repository<ServerAdminPermission> {
    /**
     * server_admin_permission select - One
     * @param {SelectOptions} options
     */
    async selectOne(options: SelectOptions): Promise<Select> {
        const { transaction } = options || {};

        const qb = createSelectQueryBuilder<ServerAdminPermission>(ServerAdminPermission, TABLE_ALIAS, {
            repository: this,
            transaction,
        });

        return select(qb, options).getRawOne<Select>();
    }
    /**
     * server_admin_permission select - Many
     * @param {SelectOptions} options
     */
    async selectMany(options: SelectOptions): Promise<Select[]> {
        const { transaction } = options || {};

        const qb = createSelectQueryBuilder<ServerAdminPermission>(ServerAdminPermission, TABLE_ALIAS, {
            repository: this,
            transaction,
        });

        return select(qb, options).getRawMany<Select>();
    }

    /**
     * [ 서버 관리자 상세 조회 ]
     */
    async findDetail(options: FindDetail): Promise<any> {
        const { transaction, where } = options || {};
        const { guild_id, user_id, server_guild_id } = where || {};

        const qb = createSelectQueryBuilder<ServerAdminPermission>(ServerAdminPermission, TABLE_ALIAS, {
            repository: this,
            transaction,
        });

        // SELECT
        qb.select([
            `${TABLE_ALIAS}.id              AS id`,
            'guild.id              AS server_guild_id',
            `${TABLE_ALIAS}.guild_id        AS guild_id`,
            `${TABLE_ALIAS}.user_id         AS user_id`,
        ]);

        // JOIN
        qb.leftJoin('guild', 'guild', `guild.id = ${TABLE_ALIAS}.guild_id`);

        if (user_id) qb.andWhere(`${TABLE_ALIAS}.user_id = :user_id`, { user_id });
        if (server_guild_id) qb.andWhere('guild.id = :server_guild_id', { server_guild_id });
        if (guild_id) qb.andWhere(`${TABLE_ALIAS}.guild_id = :guild_id`, { guild_id });

        return qb.getRawOne();
    }

    /**
     * Insert
     * @param {InsertOptions} options
     */
    async _insert(options: InsertOptions): Promise<InsertResult> {
        const { transaction, values } = options;

        const qb = createInsertQueryBuilder<ServerAdminPermission>(ServerAdminPermission, TABLE_ALIAS, {
            repository: this,
            transaction,
        });

        qb.values(values);

        return qb.execute();
    }

    /**
     * Update
     * @param {UpdateOptions} options
     */
    async _update(options: UpdateOptions): Promise<UpdateResult> {
        const { transaction, values, where } = options;
        const { guild_id, user_id } = where || {};

        const checkValues = [guild_id, user_id];
        if (isAllEmpty(checkValues)) throw Error(ERROR_MESSAGES.PRAMITER_REQUIRED);

        const qb = createUpdateQueryBuilder<ServerAdminPermission>(ServerAdminPermission, TABLE_ALIAS, {
            repository: this,
            transaction,
        });

        qb.set(values);

        // WHERE
        qb.where('guild_id = :guild_id', { guild_id });
        qb.andWhere('user_id = :user_id', { user_id });

        return qb.execute();
    }

    /**
     * Delete
     * @param {DeleteOptions} options
     */
    async _delete(options: DeleteOptions): Promise<DeleteResult> {
        const { transaction, where } = options || {};
        const { guild_id, user_id, IN } = where || {};
        const { user_ids } = IN || {};

        const checkValues = [guild_id, user_id, user_ids];
        if (isAllEmpty(checkValues)) throw Error(ERROR_MESSAGES.PRAMITER_REQUIRED);

        const qb = createDeleteQueryBuilder<ServerAdminPermission>(ServerAdminPermission, TABLE_ALIAS, {
            repository: this,
            transaction,
        });

        // WHERE
        qb.where('guild_id = :guild_id', { guild_id });
        if (user_id) qb.andWhere('user_id = :user_id', { user_id });
        // IN
        if (user_ids) qb.andWhere('user_id IN (:user_ids)', { user_ids });

        return qb.execute();
    }
}
