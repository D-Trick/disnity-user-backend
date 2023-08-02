// types
import type { InsertResult } from 'typeorm';
import type {
    Select,
    SelectOptions,
    InsertOptions,
    UpdateOptions,
    DeleteOptions,
} from '@databases/ts/interfaces/guilds-scheduled.interface';
// lib
import { Repository, SelectQueryBuilder } from 'typeorm';
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
import { GuildScheduled } from '@databases/entities/guild-scheduled.entity';
// repositorys
import { CustomRepository } from '@common/modules/typeorm-custom-repository.module';

// ----------------------------------------------------------------------
const TABLE_ALIAS = 'scheduled';
// ----------------------------------------------------------------------
function select(qb: SelectQueryBuilder<GuildScheduled>, options: SelectOptions) {
    const { where } = options || {};
    const { scheduled_start_time, scheduled_end_time } = where || {};

    // SELECT
    qb.select([
        `${TABLE_ALIAS}.id                                   AS id`,
        'guild.id                                            AS guild_id',
        'guild.name                                          AS guild_name',
        'guild.icon                                          AS guild_icon',
        `${TABLE_ALIAS}.name                                 AS name`,
        `${TABLE_ALIAS}.description                          AS description`,
        `DATE_FORMAT(scheduled_start_time, '%Y-%m-%d %H:%i') AS scheduled_start_time`,
        `DATE_FORMAT(scheduled_end_time, '%Y-%m-%d %H:%i')   AS scheduled_end_time`,
        `${TABLE_ALIAS}.image                                AS image`,
    ]);

    // JOIN
    qb.leftJoin('guild', 'guild', `guild.id = ${TABLE_ALIAS}.guild_id`);

    // WHERE
    qb.andWhere(`guild.server_refresh_date >= date_add(NOW(), interval - 1 month)`);
    if (scheduled_start_time) qb.where('scheduled_start_time >= :scheduled_start_time', { scheduled_start_time });
    if (scheduled_end_time) qb.andWhere('scheduled_end_time <= :scheduled_end_time', { scheduled_end_time });

    return qb;
}
// ----------------------------------------------------------------------

@CustomRepository(GuildScheduled)
export class GuildsScheduledRepository extends Repository<GuildScheduled> {
    /**
     * guild_scheduled select - One
     * @param {SelectOptions} options
     */
    async selectOne(options: SelectOptions): Promise<Select> {
        const { transaction } = options || {};

        const qb = createSelectQueryBuilder<GuildScheduled>(GuildScheduled, TABLE_ALIAS, {
            repository: this,
            transaction,
        });

        return select(qb, options).getRawOne<Select>();
    }
    /**
     * guild_scheduled select - Many
     * @param {SelectOptions} options
     */
    async selectMany(options: SelectOptions): Promise<Select[]> {
        const { transaction } = options || {};

        const qb = createSelectQueryBuilder<GuildScheduled>(GuildScheduled, TABLE_ALIAS, {
            repository: this,
            transaction,
        });

        return select(qb, options).getRawMany<Select>();
    }

    /**
     * Insert
     * @param {InsertOptions} options
     */
    async _insert(options: InsertOptions): Promise<InsertResult> {
        const { transaction, values } = options;

        const qb = createInsertQueryBuilder<GuildScheduled>(GuildScheduled, TABLE_ALIAS, {
            repository: this,
            transaction,
        });

        qb.into(GuildScheduled).values(values);

        return qb.execute();
    }

    /**
     * Update
     * @param {UpdateOptions} options
     */
    async _update(options: UpdateOptions): Promise<any> {
        const { transaction, values, where } = options || {};
        const { id, guild_id } = where || {};

        const checkValues = [id, guild_id];
        if (isAllEmpty(checkValues)) throw Error(ERROR_MESSAGES.PRAMITER_REQUIRED);

        const qb = createUpdateQueryBuilder<GuildScheduled>(GuildScheduled, TABLE_ALIAS, {
            repository: this,
            transaction,
        });

        qb.set(values);

        if (id) qb.where('id = :id', { id });
        if (guild_id) qb.andWhere('guild_id = :guild_id', { guild_id });

        return qb.execute();
    }

    /**
     * Delete
     * @param {DeleteOptions} options
     */
    async _delete(options: DeleteOptions): Promise<any> {
        const { transaction, where } = options || {};
        const { id, guild_id } = where || {};

        const checkValues = [id, guild_id];
        if (isAllEmpty(checkValues)) throw Error(ERROR_MESSAGES.PRAMITER_REQUIRED);

        const qb = createDeleteQueryBuilder<GuildScheduled>(GuildScheduled, TABLE_ALIAS, {
            repository: this,
            transaction,
        });

        if (id) qb.where('id = :id', { id });
        if (guild_id) qb.andWhere('guild_id = :guild_id', { guild_id });

        return qb.execute();
    }
}
