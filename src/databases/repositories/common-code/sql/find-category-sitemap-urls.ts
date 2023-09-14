// types
import type { SqlOptions } from '@common/types/sql-options.type';
// lib
import { Repository } from 'typeorm';
// utils
import { createSelectQueryBuilder } from '@databases/utils/createQueryBuilder';
// configs
import { baseConfig } from '@config/basic.config';
// alias
import { COMMON_CODE_TABLE_ALIAS as TABLE_ALIAS } from '@databases/common/table-alias';
// entities
import { CommonCode } from '@databases/entities/common-code.entity';

// ----------------------------------------------------------------------

export async function findCategorySitemapUrls(
    repository: Repository<CommonCode>,
    options: SqlOptions,
): Promise<{ url: string }[]> {
    const { transaction } = options || {};

    const qb = createSelectQueryBuilder<CommonCode>(CommonCode, TABLE_ALIAS, {
        repository,
        transaction,
    });

    // SELECT
    qb.select([`CONCAT('${baseConfig.url}', '/servers/categorys/', value) as url`]);

    // WHERE
    qb.where("code = 'category'");

    return qb.getRawMany();
}
