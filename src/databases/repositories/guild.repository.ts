// types
import type { DeleteResult, InsertResult, SelectQueryBuilder, UpdateResult } from 'typeorm';
import type { Config } from '@lib/utiles/Nplus1';
import type { Select } from '@databases/ts/types/guild.type';
import type { SqlOptions } from '@common/ts/interfaces/sql-options.interface';
import type {
    Count,
    FindMany,
    FindDetail,
    GetIdsOptions,
    SelectOptions,
    FindManyOptions,
    TotalCountOptions,
    FindDetailOptions,
    AdminTotalCountOptions,
    SearchTotalCountOptions,
    GetIdsBySearchOptions,
    InsertOptions,
    UpdateOptions,
    BulkUpdateOptions,
    DeleteOptions,
} from '@databases/ts/interfaces/guild.interface';
// lib
import { Brackets, Repository } from 'typeorm';
import { bulkUpdateQueryFormat, isAllEmpty } from '@lib/utiles';
import Nplus1 from '@lib/utiles/Nplus1';
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
import { Guild } from '@databases/entities/guild.entity';
// repositorys
import { CustomRepository } from '@common/modules/typeorm-custom-repository.module';

// ----------------------------------------------------------------------
const TABLE_ALIAS = 'guild';
// ----------------------------------------------------------------------
function select(qb: SelectQueryBuilder<Guild>, options: SelectOptions) {
    const { where } = options || {};
    const { id, user_id, wirter_id } = where || {};

    // SELECT
    qb.select([
        `${TABLE_ALIAS}.id                                                           AS id`,
        `${TABLE_ALIAS}.name                                                         AS name`,
        `${TABLE_ALIAS}.summary                                                      AS summary`,
        `${TABLE_ALIAS}.content                                                      AS content`,
        `${TABLE_ALIAS}.is_markdown                                                  AS is_markdown`,
        `${TABLE_ALIAS}.icon                                                         AS icon`,
        `${TABLE_ALIAS}.link_type                                                    AS link_type`,
        `${TABLE_ALIAS}.online                                                       AS online`,
        `${TABLE_ALIAS}.member                                                       AS member`,
        `${TABLE_ALIAS}.premium_tier                                                 AS premium_tier`,
        `${TABLE_ALIAS}.membership_url                                               AS membership_url`,
        `${TABLE_ALIAS}.is_open                                                      AS is_open`,
        `${TABLE_ALIAS}.is_admin_open                                                AS is_admin_open`,
        `${TABLE_ALIAS}.is_bot                                                       AS is_bot`,
        `${TABLE_ALIAS}.invite_code                                                  AS invite_code`,
        `DATE_FORMAT(${TABLE_ALIAS}.created_at, '%Y-%m-%d %H:%i:%S')                 AS created_at`,
        `DATE_FORMAT(${TABLE_ALIAS}.updated_at, '%Y-%m-%d %H:%i:%S')                 AS updated_at`,
        `DATE_FORMAT(${TABLE_ALIAS}.server_refresh_date, '%Y-%m-%d %H:%i:%S')        AS server_refresh_date`,
    ]);

    // JOIN
    if (user_id) {
        qb.leftJoin('server_admin_permission', 'admin', `${TABLE_ALIAS}.id = admin.guild_id`);
    }

    // WHERE
    if (id) qb.andWhere(`${TABLE_ALIAS}.id = :id`, { id });
    if (wirter_id) qb.andWhere(`${TABLE_ALIAS}.user_id = :wirter_id`, { wirter_id });
    if (user_id) {
        qb.andWhere(
            new Brackets((qb) => {
                qb.where(`${TABLE_ALIAS}.user_id = :user_id`, { user_id });
                qb.orWhere('admin.user_id = :user_id', { user_id });
            }),
        );
    }

    return qb;
}
// ----------------------------------------------------------------------

@CustomRepository(Guild)
export class GuildRepository extends Repository<Guild> {
    /**
     * 서버 총 합계
     * @param {TotalCountOptions} options
     */
    async totalCount(options: TotalCountOptions): Promise<Count> {
        const { transaction, where } = options || {};
        const { category_id, user_id, min, max } = where || {};

        const qb = createSelectQueryBuilder<Guild>(Guild, TABLE_ALIAS, {
            repository: this,
            transaction,
        });

        // SELECT
        qb.select([`IFNULL(COUNT(${TABLE_ALIAS}.id), 0) AS count`]);

        // JOIN
        qb.leftJoin(
            'common_code',
            'comm',
            `comm.code = 'category'
             AND ${TABLE_ALIAS}.category_id = comm.value`,
        );
        if (user_id) {
            qb.leftJoin('server_admin_permission', 'admin', `${TABLE_ALIAS}.id = admin.guild_id`);
        }

        // WHERE
        if (user_id) {
            qb.where(
                new Brackets((qb) => {
                    qb.where(`${TABLE_ALIAS}.user_id = :user_id`, { user_id });
                    qb.orWhere('admin.user_id = :user_id', { user_id });
                }),
            );
        } else {
            qb.andWhere(`${TABLE_ALIAS}.server_refresh_date >= date_add(NOW(), interval - 1 month)`);
            qb.andWhere(`${TABLE_ALIAS}.is_open = 1`);
            qb.andWhere(`${TABLE_ALIAS}.is_admin_open = 1`);
            qb.andWhere(`${TABLE_ALIAS}.is_bot = 1`);
            if (min === 5000 && max === 5000) {
                qb.andWhere('member >= 5000');
            } else if ((min >= 1 && max < 5000) || (min > 1 && max <= 5000)) {
                qb.andWhere('member BETWEEN :min AND :max', {
                    min,
                    max,
                });
            }
            if (category_id) qb.andWhere('comm.value = :category_id', { category_id });
        }

        return qb.getRawOne();
    }

    /**
     * 검색된 서버 총 합계
     * @param {SearchTotalCountOptions} options
     */
    async searchTotalCount(options: SearchTotalCountOptions): Promise<Count> {
        const { transaction, where } = options || {};
        const { keyword, min, max } = where || {};

        const qb = createSelectQueryBuilder<Guild>(Guild, TABLE_ALIAS, {
            repository: this,
            transaction,
        });

        // SELECT
        qb.select([`IFNULL(COUNT(DISTINCT ${TABLE_ALIAS}.id), 0) AS count`]);

        // JOIN
        qb.leftJoin('tag', 'tag', `${TABLE_ALIAS}.id = tag.guild_id`);

        // WHERE
        qb.andWhere(`${TABLE_ALIAS}.server_refresh_date >= date_add(NOW(), interval - 1 month)`);
        qb.andWhere(`${TABLE_ALIAS}.is_open = 1`);
        qb.andWhere(`${TABLE_ALIAS}.is_admin_open = 1`);
        qb.andWhere(`${TABLE_ALIAS}.is_bot = 1`);
        if (min === 5000 && max === 5000) {
            qb.andWhere('member >= 5000');
        } else if ((min >= 1 && max < 5000) || (min > 1 && max <= 5000)) {
            qb.andWhere('member BETWEEN :min AND :max', {
                min,
                max,
            });
        }
        qb.andWhere(
            new Brackets((qb) => {
                qb.where(`${TABLE_ALIAS}.name LIKE concat('%', LOWER(replace(:keyword, ' ', '')), '%')`, { keyword })
                    .orWhere(`${TABLE_ALIAS}.summary LIKE concat('%', LOWER(replace(:keyword, ' ', '')), '%')`, {
                        keyword,
                    })
                    .orWhere(`tag.name LIKE concat('%', LOWER(replace(:keyword, ' ', '')), '%')`, { keyword });
            }),
        );

        return qb.getRawOne();
    }

    /**
     * 관리자 권한이 있는 서버 총 합계
     * @param {AdminTotalCountOptions} options
     */
    async adminTotalCount(options: AdminTotalCountOptions): Promise<Count> {
        const { transaction, where } = options || {};
        const { id, user_id } = where || {};

        const qb = createSelectQueryBuilder<Guild>(Guild, TABLE_ALIAS, {
            repository: this,
            transaction,
        });

        // SELECT
        qb.select([`IFNULL(COUNT(DISTINCT ${TABLE_ALIAS}.id), 0) AS count`]);

        // JOIN
        qb.leftJoin('server_admin_permission', 'admin', `${TABLE_ALIAS}.id = admin.guild_id`);

        // WHERE
        qb.andWhere(`${TABLE_ALIAS}.id = :id`, { id });
        qb.andWhere(`${TABLE_ALIAS}.server_refresh_date >= date_add(NOW(), interval - 1 month)`);
        qb.andWhere(
            new Brackets((qb) => {
                qb.where(`${TABLE_ALIAS}.user_id = :user_id`, { user_id });
                qb.orWhere('admin.user_id = :user_id', { user_id });
            }),
        );

        return qb.getRawOne();
    }

    /**
     * Guild Select- One
     * @param {SelectOptions} options
     */
    async selectOne(options: SelectOptions): Promise<Select> {
        const { transaction } = options || {};

        const qb = createSelectQueryBuilder<Guild>(Guild, TABLE_ALIAS, {
            repository: this,
            transaction,
        });

        return select(qb, options).getRawOne<Select>();
    }
    /**
     * Guild Select- Many
     * @param {SelectOptions} options
     */
    async selectMany(options: SelectOptions): Promise<Select[]> {
        const { transaction } = options || {};

        const qb = createSelectQueryBuilder<Guild>(Guild, TABLE_ALIAS, {
            repository: this,
            transaction,
        });

        return select(qb, options).getRawMany<Select>();
    }

    /**
     * 가공된 서버상세 조회
     * @param {FindDetailOptions} options
     * @return 서버상세 정보
     */
    async findDetail(options: FindDetailOptions): Promise<FindDetail> {
        const { transaction, where } = options || {};
        const { id, user_id } = where || {};

        const qb = createSelectQueryBuilder<Guild>(Guild, TABLE_ALIAS, {
            repository: this,
            transaction,
        });

        // SELECT
        qb.select([
            `${TABLE_ALIAS}.id                                                      AS id`,
            `${TABLE_ALIAS}.name                                                    AS name`,
            `${TABLE_ALIAS}.summary                                                 AS summary`,
            `${TABLE_ALIAS}.content                                                 AS content`,
            `${TABLE_ALIAS}.is_markdown                                             AS is_markdown`,
            `${TABLE_ALIAS}.icon                                                    AS icon`,
            `${TABLE_ALIAS}.splash                                                  AS splash`,
            `${TABLE_ALIAS}.online                                                  AS online`,
            `${TABLE_ALIAS}.member                                                  AS member`,
            `${TABLE_ALIAS}.premium_tier                                            AS premium_tier`,
            `${TABLE_ALIAS}.link_type                                               AS link_type`,
            `${TABLE_ALIAS}.invite_code                                             AS invite_code`,
            `${TABLE_ALIAS}.membership_url                                          AS membership_url`,
            `${TABLE_ALIAS}.is_open                                                 AS is_open`,
            `${TABLE_ALIAS}.is_bot                                                  AS is_bot`,
            `DATE_FORMAT(${TABLE_ALIAS}.created_at, '%Y-%m-%d %H:%i:%S')            AS created_at`,
            `DATE_FORMAT(${TABLE_ALIAS}.updated_at, '%Y-%m-%d %H:%i:%S')            AS updated_at`,
            `DATE_FORMAT(${TABLE_ALIAS}.server_refresh_date, '%Y-%m-%d %H:%i:%s')   AS server_refresh_date`,
        ]);
        // SELECT common
        qb.addSelect([
            'comm.value                                                     AS category_id',
            'comm.name                                                      AS category_name',
        ]);
        // SELECT tag
        qb.addSelect([
            `tag.guild_id                                                   AS tag_guild_id`,
            `tag.name                                                       AS tag_name`,
        ]);
        // SELECT server_admin_permission
        qb.addSelect([`admin.guild_id                                       AS admin_guild_id`]);
        // SELECT user
        qb.addSelect([
            'user.id                                                        AS admin_id',
            'user.global_name                                               AS admin_global_name',
            'user.username                                                  AS admin_username',
            'user.avatar                                                    AS admin_avatar',
            'user.discriminator                                             AS admin_discriminator',
        ]);

        // JOIN
        qb.leftJoin(
            'common_code',
            'comm',
            `comm.code = 'category'
                 AND ${TABLE_ALIAS}.category_id = comm.value`,
        );
        qb.leftJoin('tag', 'tag', `${TABLE_ALIAS}.id = tag.guild_id`);
        qb.leftJoin('server_admin_permission', 'admin', `${TABLE_ALIAS}.id = admin.guild_id`);
        qb.leftJoin('user', 'user', 'user.id = admin.user_id');

        // WHERE
        qb.where(`${TABLE_ALIAS}.id = :id`, { id });
        if (!user_id) {
            qb.andWhere(`${TABLE_ALIAS}.is_admin_open = 1`);
            qb.andWhere(`${TABLE_ALIAS}.is_open = 1`);
            qb.andWhere(`${TABLE_ALIAS}.is_bot = 1`);
        }

        // ORDER BY
        qb.orderBy('tag.id');

        // N + 1 FORMAT
        const queryResult = await qb.getRawMany();

        const config: Config = { primaryColumnName: 'id', joinGroups: [] };
        config.joinGroups.push({
            outputColumnName: 'tags',
            referencedColumnName: 'tag_guild_id',
            selectColumns: [{ originalName: 'tag_name', changeName: 'name' }],
        });
        config.joinGroups.push({
            outputColumnName: 'admins',
            referencedColumnName: 'admin_guild_id',
            selectColumns: [
                { originalName: 'admin_id', changeName: 'id' },
                { originalName: 'admin_global_name', changeName: 'global_name' },
                { originalName: 'admin_username', changeName: 'username' },
                { originalName: 'admin_avatar', changeName: 'avatar' },
                { originalName: 'admin_discriminator', changeName: 'discriminator' },
            ],
        });
        const n1 = new Nplus1(queryResult, config);

        return n1.getOne();
    }

    /**
     * 서버 목록 조회
     * @param {FindManyOptions} options
     */
    async findMany(options: FindManyOptions): Promise<FindMany[]> {
        const { transaction, where, orderBy } = options || {};
        const { sort } = orderBy || {};
        const { user_id, IN } = where || {};
        const { ids } = IN || {};

        const qb = createSelectQueryBuilder<Guild>(Guild, TABLE_ALIAS, {
            repository: this,
            transaction,
        });

        // SELECT
        qb.select([
            `${TABLE_ALIAS}.id                                                      AS id`,
            `${TABLE_ALIAS}.name                                                    AS name`,
            `${TABLE_ALIAS}.summary                                                 AS summary`,
            `${TABLE_ALIAS}.icon                                                    AS icon`,
            `${TABLE_ALIAS}.online                                                  AS online`,
            `${TABLE_ALIAS}.member                                                  AS member`,
            `${TABLE_ALIAS}.banner                                                  AS banner`,
            `${TABLE_ALIAS}.link_type                                               AS link_type`,
            `${TABLE_ALIAS}.invite_code                                             AS invite_code`,
            `${TABLE_ALIAS}.is_open                                                 AS is_open`,
            `${TABLE_ALIAS}.is_admin_open                                           AS is_admin_open`,
            `${TABLE_ALIAS}.private_reason                                          AS private_reason`,
            `${TABLE_ALIAS}.is_bot                                                  AS is_bot`,
            `DATE_FORMAT(${TABLE_ALIAS}.created_at, '%Y-%m-%d %H:%i:%S')            AS created_at`,
            `DATE_FORMAT(${TABLE_ALIAS}.updated_at, '%Y-%m-%d %H:%i:%S')            AS updated_at`,
            `DATE_FORMAT(${TABLE_ALIAS}.server_refresh_date, '%Y-%m-%d %H:%i:%S')   AS server_refresh_date`,
        ]);
        // SELECT common
        qb.addSelect(['comm.name                                            AS category_name']);
        // SELECT tag
        qb.addSelect([
            `tag.id                                                         AS tag_id`,
            `tag.guild_id                                                   AS tag_guild_id`,
            `tag.name                                                       AS tag_name`,
        ]);
        // CUSTOM SELECT
        if (user_id) {
            qb.addSelect([
                `
                (CASE   WHEN
                        ${TABLE_ALIAS}.user_id = ${user_id}
                        THEN
                            1
                        ELSE
                            0
                END) AS is_writer   
            `,
            ]);
        }

        // join
        qb.leftJoin('common_code', 'comm', `comm.code = 'category' AND ${TABLE_ALIAS}.category_id = comm.value`);
        qb.leftJoin('tag', 'tag', `${TABLE_ALIAS}.id = tag.guild_id`);
        if (user_id) {
            qb.leftJoin('server_admin_permission', 'admin', `${TABLE_ALIAS}.id = admin.guild_id`);
        }

        // WHERE
        qb.where(`${TABLE_ALIAS}.id IN (:ids)`, { ids });

        // ORDER BY
        if (sort) qb.orderBy(`${TABLE_ALIAS}.${sort}`, 'DESC');
        qb.addOrderBy('tag.id', 'ASC');

        // N + 1 FORMAT
        const queryResult = await qb.getRawMany();

        const config: Config = { primaryColumnName: 'id', joinGroups: [] };
        config.joinGroups.push({
            outputColumnName: 'tags',
            referencedColumnName: 'tag_guild_id',
            selectColumns: [
                { originalName: 'tag_id', changeName: 'id' },
                { originalName: 'tag_name', changeName: 'name' },
            ],
        });
        const n1 = new Nplus1(queryResult, config);

        return n1.getMany();
    }

    /**
     * guild id 가져오기
     * @param {GetIdsOptions} options
     */
    async getIds(options: GetIdsOptions): Promise<number[]> {
        const { transaction, where, orderBy, limit, offset } = options || {};
        const { category_id, user_id, min, max } = where || {};
        const { sort } = orderBy || {};

        const qb = createSelectQueryBuilder<Guild>(Guild, TABLE_ALIAS, {
            repository: this,
            transaction,
        });

        // SELECT
        qb.select([`${TABLE_ALIAS}.id AS id`]);

        // join
        qb.leftJoin(
            'common_code',
            'comm',
            `comm.code = 'category'
                 AND ${TABLE_ALIAS}.category_id = comm.value`,
        );
        if (user_id) qb.leftJoin('server_admin_permission', 'admin', `${TABLE_ALIAS}.id = admin.guild_id`);

        // WHERE
        if (user_id) {
            qb.andWhere(
                new Brackets((qb) => {
                    qb.where(`${TABLE_ALIAS}.user_id = :user_id`, { user_id });
                    qb.orWhere('admin.user_id = :user_id', { user_id });
                }),
            );
        } else {
            qb.andWhere(`${TABLE_ALIAS}.server_refresh_date >= date_add(NOW(), interval - 1 month)`);
            qb.andWhere(`${TABLE_ALIAS}.is_open = 1`);
            qb.andWhere(`${TABLE_ALIAS}.is_admin_open = 1`);
            qb.andWhere(`${TABLE_ALIAS}.is_bot = 1`);
            if (min === 5000 && max === 5000) {
                qb.andWhere(`${TABLE_ALIAS}.member >= 5000`);
            } else if ((min >= 1 && max < 5000) || (min > 1 && max <= 5000)) {
                qb.andWhere(`${TABLE_ALIAS}.member BETWEEN :min AND :max`, {
                    min,
                    max,
                });
            }
            if (category_id) qb.andWhere('comm.value = :category_id', { category_id });
        }

        // groupBy
        qb.groupBy(`${TABLE_ALIAS}.id`);
        qb.addGroupBy('comm.value');
        if (sort) qb.addGroupBy(`${TABLE_ALIAS}.${sort}`);

        // ORDER BY
        if (sort) qb.orderBy(`${TABLE_ALIAS}.${sort}`, 'DESC');

        // LIMIT, OFFSET
        qb.limit(limit).offset(offset);

        const guilds = await qb.getRawMany();

        const guildIds = [];
        const { length } = guilds;
        for (let i = 0; i < length; i++) {
            const guild = guilds[i];

            guildIds.push(guild.id);
        }

        return guildIds;
    }

    /**
     * server에서 검색된 id 목록 가져오기
     * @param {GetIdsBySearchOptions} options
     * @returns ids
     */
    async getIdsBySearch(options: GetIdsBySearchOptions): Promise<number[]> {
        const { transaction, where, orderBy, limit, offset } = options || {};
        const { keyword, min, max } = where || {};
        const { sort } = orderBy || {};

        const qb = createSelectQueryBuilder<Guild>(Guild, TABLE_ALIAS, {
            repository: this,
            transaction,
        });

        // SELECT
        qb.select([`${TABLE_ALIAS}.id AS id`]);

        // join
        qb.leftJoin('tag', 'tag', `${TABLE_ALIAS}.id = tag.guild_id`);

        // WHERE
        qb.where(`${TABLE_ALIAS}.server_refresh_date >= date_add(NOW(), interval - 1 month)`);
        qb.andWhere(`${TABLE_ALIAS}.is_open = 1`);
        qb.andWhere(`${TABLE_ALIAS}.is_admin_open = 1`);
        qb.andWhere(`${TABLE_ALIAS}.is_bot = 1`);
        if (min === 5000 && max === 5000) {
            qb.andWhere(`${TABLE_ALIAS}.member >= 5000`);
        } else if ((min >= 1 && max < 5000) || (min > 1 && max <= 5000)) {
            qb.andWhere(`${TABLE_ALIAS}.member BETWEEN :min AND :max`, {
                min,
                max,
            });
        }
        qb.andWhere(
            new Brackets((qb) => {
                qb.where(`${TABLE_ALIAS}.name LIKE concat('%', LOWER(replace(:keyword, ' ', '')), '%')`, { keyword })
                    .orWhere(`${TABLE_ALIAS}.summary LIKE concat('%', LOWER(replace(:keyword, ' ', '')), '%')`, {
                        keyword,
                    })
                    .orWhere(`tag.name LIKE concat('%', LOWER(replace(:keyword, ' ', '')), '%')`, { keyword });
            }),
        );

        // groupBy
        qb.groupBy(`${TABLE_ALIAS}.id`);
        if (sort) qb.addGroupBy(`${TABLE_ALIAS}.${sort}`);

        // ORDER BY
        if (sort) qb.orderBy(`${TABLE_ALIAS}.${sort}`, 'DESC');

        // LIMIT, OFFSET
        qb.limit(limit).offset(offset);

        const guilds = await qb.getRawMany();

        const guildIds = [];
        const { length } = guilds;
        for (let i = 0; i < length; i++) {
            const guild = guilds[i];

            guildIds.push(guild.id);
        }

        return guildIds;
    }

    /**
     * sitemap server url 가져오기
     * @param {SqlOptions} options
     * @returns server urls
     */
    async getServerUrls(options?: SqlOptions): Promise<string[]> {
        const { transaction } = options || {};

        const qb = createSelectQueryBuilder<Guild>(Guild, TABLE_ALIAS, {
            repository: this,
            transaction,
        });

        // SELECT
        qb.select([`CONCAT('${baseConfig.url}', '/servers/', id) as url`]);

        // WHERE
        qb.andWhere('server_refresh_date >= date_add(NOW(), interval - 1 month)');
        qb.andWhere('is_open = 1');
        qb.andWhere('is_admin_open = 1');
        qb.andWhere('is_bot = 1');

        // ORDER BY
        qb.orderBy(`id`);

        const guilds = await qb.getRawMany();

        const serverUrls = [];
        const { length } = guilds;
        for (let i = 0; i < length; i++) {
            const guild = guilds[i];

            serverUrls.push(guild.url);
        }

        return serverUrls;
    }

    /**
     * Insert
     * @param {InsertOptions} options
     */
    async _insert(options: InsertOptions): Promise<InsertResult> {
        const { transaction, values } = options || {};

        const qb = createInsertQueryBuilder<Guild>(Guild, TABLE_ALIAS, {
            repository: this,
            transaction,
        });

        qb.into(Guild).values(values);

        return qb.execute();
    }

    /**
     * Update
     * @param {UpdateOptions} options
     */
    async _update(options: UpdateOptions): Promise<UpdateResult> {
        const { transaction, values, where } = options || {};
        const { id, user_id } = where || {};

        const checkValues = [id, user_id];
        if (isAllEmpty(checkValues)) throw Error(ERROR_MESSAGES.PRAMITER_REQUIRED);

        const qb = createUpdateQueryBuilder<Guild>(Guild, TABLE_ALIAS, {
            repository: this,
            transaction,
        });

        qb.set(values);

        // WHERE
        if (id) qb.andWhere('id = :id', { id });
        if (user_id) qb.andWhere('user_id = :user_id', { user_id });

        return qb.execute();
    }

    /**
     * Bulk Update
     * @param {BulkUpdateOptions} options
     */
    async bulkUpdate(options: BulkUpdateOptions): Promise<UpdateResult> {
        const { transaction, values, where } = options || {};
        const { IN } = where || {};
        const { ids } = IN || {};

        const bulkValues = bulkUpdateQueryFormat(ids, values);

        const qb = createUpdateQueryBuilder<Guild>(Guild, TABLE_ALIAS, {
            repository: this,
            transaction,
        });

        qb.set(bulkValues);

        // WHERE
        qb.where('id IN (:ids)', { ids });

        return qb.execute();
    }

    /**
     * Delete
     * @param {DeleteOptions} options
     */
    async _delete(options: DeleteOptions): Promise<DeleteResult> {
        const { transaction, where } = options || {};
        const { id, user_id } = where || {};

        const checkValues = [id, user_id];
        if (isAllEmpty(checkValues)) throw Error(ERROR_MESSAGES.PRAMITER_REQUIRED);

        const qb = createDeleteQueryBuilder<Guild>(Guild, TABLE_ALIAS, {
            repository: this,
            transaction,
        });

        // WHERE
        if (id) qb.andWhere('id = :id', { id });
        if (user_id) qb.andWhere('user_id = :user_id', { user_id });

        return qb.execute();
    }
}
