// types
import type { Select } from '@databases/ts/types/common-code.type';
import type { SqlOptions } from '@common/ts/interfaces/sql-options.interface';
import type { SelectOptions } from '@databases/ts/interfaces/common-code.interface';
import type { SelectQueryBuilder } from 'typeorm';
// lib
import { Repository } from 'typeorm';
import { createSelectQueryBuilder } from '@databases/utils/createQueryBuilder';
// configs
import { baseConfig } from '@config/basic.config';
// entities
import { CommonCode } from '@databases/entities/common-code.entity';
// repositorys
import { CustomRepository } from '@common/modules/typeorm-custom-repository.module';

// ----------------------------------------------------------------------
const TABLE_ALIAS = 'common_code';
// ----------------------------------------------------------------------
function select(qb: SelectQueryBuilder<CommonCode>, options: SelectOptions) {
    const { where } = options || {};
    const { code, value } = where || {};

    // SELECT
    qb.select([
        `${TABLE_ALIAS}.id                  AS id`,
        `${TABLE_ALIAS}.name                AS name`,
        `${TABLE_ALIAS}.value               AS value`,
    ]);

    // WHERE
    qb.where('code = :code', { code });
    if (value) qb.andWhere('value = :value', { value });

    return qb;
}
// ----------------------------------------------------------------------

@CustomRepository(CommonCode)
export class CommonCodeRepository extends Repository<CommonCode> {
    /**
     * CommonCode 조회 - One
     * @param {SelectOptions} options
     */
    async selectOne(options: SelectOptions): Promise<Select> {
        const { transaction } = options || {};

        const qb = createSelectQueryBuilder<CommonCode>(CommonCode, TABLE_ALIAS, {
            repository: this,
            transaction,
        });

        return select(qb, options).getRawOne<Select>();
    }
    /**
     * CommonCode 조회 - Many
     * @param {SelectOptions} options
     */
    async selectMany(options: SelectOptions): Promise<Select[]> {
        const { transaction } = options || {};

        const qb = createSelectQueryBuilder<CommonCode>(CommonCode, TABLE_ALIAS, {
            repository: this,
            transaction,
        });

        return select(qb, options).getRawMany<Select>();
    }

    /**
     * sitemap category url 가져오기
     * @param {SqlOptions} options
     * @returns category urls
     */
    async getCategoryUrls(options?: SqlOptions): Promise<string[]> {
        const { transaction } = options || {};

        const qb = createSelectQueryBuilder<CommonCode>(CommonCode, TABLE_ALIAS, {
            repository: this,
            transaction,
        });

        // SELECT
        qb.select([`CONCAT('${baseConfig.url}', '/servers/category/', value) as url`]);

        // WHERE
        qb.where(`code = 'category'`);

        // ORDER BY
        qb.orderBy(`id`);

        const commonCodes = await qb.getRawMany();

        const categoryUrls = [];
        const length = commonCodes.length;
        for (let i = 0; i < length; i++) {
            categoryUrls.push(commonCodes[i].url);
        }

        return categoryUrls;
    }
}
