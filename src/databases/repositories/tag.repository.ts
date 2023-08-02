// types
import type { DeleteResult, InsertResult, UpdateResult } from 'typeorm';
import type { SqlOptions } from '@common/ts/interfaces/sql-options.interface';
import type { Count } from '@databases/ts/interfaces/guild.interface';
import type {
    FindManyOptions,
    ServerTotalCountOptions,
    InsertOptions,
    UpdateOptions,
    DeleteOptions,
    FindAll,
} from '@databases/ts/interfaces/tag.interface';
// lib
import { Repository } from 'typeorm';
import { isAllEmpty } from '@lib/utiles';
import {
    createDeleteQueryBuilder,
    createInsertQueryBuilder,
    createSelectQueryBuilder,
    createUpdateQueryBuilder,
} from '@databases/utils/createQueryBuilder';
// configs
import { baseConfig } from '@config/basic.config';
// messages
import { ERROR_MESSAGES } from '@common/messages';
// entities
import { Tag } from '@databases/entities/tag.entity';
// repositorys
import { CustomRepository } from '@common/modules/typeorm-custom-repository.module';

// ----------------------------------------------------------------------
const TABLE_ALIAS = 'tag';
// ----------------------------------------------------------------------

@CustomRepository(Tag)
export class TagRepository extends Repository<Tag> {
    /**
     * 태그명(총 합계) 형태로 가져온다.
     * @param {SqlOptions} options?
     */
    async findAll(options?: SqlOptions): Promise<FindAll[]> {
        const { transaction } = options || {};

        const qb = createSelectQueryBuilder<Tag>(Tag, TABLE_ALIAS, {
            repository: this,
            transaction,
        });

        // SELECT
        qb.select([
            `${TABLE_ALIAS}.name                               AS name`,
            `IFNULL(COUNT(${TABLE_ALIAS}.name), 0)             AS total `,
        ]);

        // JOIN
        qb.innerJoin('guild', 'guild', `guild.id = ${TABLE_ALIAS}.guild_id`);

        // WHERE
        qb.andWhere('guild.server_refresh_date >= date_add(NOW(), interval - 1 month)');
        qb.andWhere('guild.is_open = 1');
        qb.andWhere('guild.is_admin_open = 1');

        // GROUP BY
        qb.groupBy(`${TABLE_ALIAS}.name`);

        // ORDER BY
        qb.orderBy('total', 'DESC').addOrderBy('name');

        return qb.getRawMany();
    }

    /**
     * 서버 목록 전체 개수
     * @param {ServerTotalCountOptions} options
     */
    async serverTotalCount(options: ServerTotalCountOptions): Promise<Count> {
        const { transaction, where } = options || {};
        const { tag_name, min, max } = where || {};

        const qb = createSelectQueryBuilder<Tag>(Tag, TABLE_ALIAS, {
            repository: this,
            transaction,
        });

        // SELECT
        qb.select([`IFNULL(COUNT(DISTINCT guild.id), 0) AS count`]);

        // JOIN
        qb.innerJoin('guild', 'guild', `guild.id = tag.guild_id`);

        // WHERE
        qb.andWhere(`guild.server_refresh_date >= date_add(NOW(), interval - 1 month)`);
        qb.andWhere('guild.is_open = 1');
        qb.andWhere('guild.is_admin_open = 1');
        if (tag_name) qb.andWhere('tag.name = :tag_name', { tag_name });
        if (min === 5000 && max === 5000) {
            qb.andWhere('member >= 5000');
        } else if ((min >= 1 && max < 5000) || (min > 1 && max <= 5000)) {
            qb.andWhere('member BETWEEN :min AND :max', {
                min,
                max,
            });
        }

        return qb.getRawOne();
    }

    /**
     * 태그명에 해당하는 server id 목록을 가져온다.
     * @param {FindManyOptions} options
     * @returns sever.id 목록의 배열
     */
    async getIdsByServer(options: FindManyOptions): Promise<number[]> {
        const { transaction, where, orderBy, limit, offset } = options || {};
        const { tag_name, min, max } = where || {};
        const { sort } = orderBy || {};

        const qb = transaction
            ? transaction.manager.createQueryBuilder(Tag, TABLE_ALIAS, transaction)
            : this.createQueryBuilder(TABLE_ALIAS);

        // SELECT
        qb.select([`${TABLE_ALIAS}.guild_id AS guild_id`]);

        // JOIN
        qb.innerJoin('guild', 'guild', `guild.id = ${TABLE_ALIAS}.guild_id`);

        // WHERE
        qb.where('guild.server_refresh_date >= date_add(NOW(), interval - 1 month)');
        qb.andWhere('guild.is_open = 1');
        qb.andWhere('guild.is_admin_open = 1');
        qb.andWhere('guild.is_bot = 1');
        if (min === 5000 && max === 5000) {
            qb.andWhere('guild.member >= 5000');
        } else if ((min >= 1 && max < 5000) || (min > 1 && max <= 5000)) {
            qb.andWhere('guild.member BETWEEN :min AND :max', {
                min,
                max,
            });
        }
        if (tag_name) qb.andWhere(`${TABLE_ALIAS}.name = :tag_name`, { tag_name });

        // GROUP BY
        qb.groupBy(`${TABLE_ALIAS}.guild_id`);
        if (sort) qb.addGroupBy(`guild.${sort}`);

        // ORDER BY
        if (sort) qb.orderBy(`guild.${sort}`, 'DESC');

        // limit, offset
        qb.limit(limit).offset(offset);

        const guilds = await qb.getRawMany();

        const guildIds = [];
        const length = guilds.length;
        for (let i = 0; i < length; i++) {
            const guild = guilds[i];

            guildIds.push(guild.guild_id);
        }

        return guildIds;
    }

    /**
     * sitemap tag url 가져오기
     * @param {SqlOptions} options
     */
    async getTagUrls(options?: SqlOptions): Promise<string[]> {
        const { transaction } = options || {};

        const qb = transaction
            ? transaction.manager.createQueryBuilder(Tag, TABLE_ALIAS, transaction)
            : this.createQueryBuilder(TABLE_ALIAS);

        // SELECT
        qb.select([`CONCAT('${baseConfig.url}', '/servers/tags/', ${TABLE_ALIAS}.name) as url`]);

        // JOIN
        qb.leftJoin('guild', 'guild', `guild.id = ${TABLE_ALIAS}.guild_id`);

        // GROUP BY
        qb.groupBy(`${TABLE_ALIAS}.name`);

        // WHERE
        qb.andWhere(`guild.server_refresh_date >= date_add(NOW(), interval - 1 month)`);

        const tags = await qb.getRawMany();

        const tagUrls = [];
        const length = tags.length;
        for (let i = 0; i < length; i++) {
            const tag = tags[i];

            tagUrls.push(tag.url);
        }

        return tagUrls;
    }

    /**
     * INSERT
     * @param {InsertOptions} options
     */
    async _insert(options: InsertOptions): Promise<InsertResult> {
        const { transaction, values } = options || {};

        const qb = createInsertQueryBuilder<Tag>(Tag, TABLE_ALIAS, {
            repository: this,
            transaction,
        });

        qb.into(Tag).values(values);

        return qb.execute();
    }

    /**
     * UPDATE
     * @param {UpdateOptions} options
     */
    async _update(options: UpdateOptions): Promise<UpdateResult> {
        const { transaction, values, where } = options || {};
        const { id, guild_id } = where || {};

        const checkValues = [id, guild_id];
        if (isAllEmpty(checkValues)) throw Error(ERROR_MESSAGES.PRAMITER_REQUIRED);

        const qb = createUpdateQueryBuilder<Tag>(Tag, TABLE_ALIAS, {
            repository: this,
            transaction,
        });

        qb.set(values);

        // WHERE
        if (id) qb.andWhere('id = :id', { id });
        if (guild_id) qb.andWhere('guild_id = :guild_id', { guild_id });

        return qb.execute();
    }

    /**
     * DELETE
     * @param {DeleteOptions} options
     */
    async _delete(options: DeleteOptions): Promise<DeleteResult> {
        const { transaction, where } = options || {};
        const { id, guild_id } = where || {};

        const checkValues = [id, guild_id];
        if (isAllEmpty(checkValues)) throw Error(ERROR_MESSAGES.PRAMITER_REQUIRED);

        const qb = createDeleteQueryBuilder<Tag>(Tag, TABLE_ALIAS, {
            repository: this,
            transaction,
        });

        // WHERE
        if (id) qb.andWhere('id = :id', { id });
        if (guild_id) qb.andWhere('guild_id = :guild_id', { guild_id });

        return qb.execute();
    }
}
