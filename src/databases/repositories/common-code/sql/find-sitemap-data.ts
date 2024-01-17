// types
import type { SqlOptions } from '@common/types/sql-options.type';
// lib
import { Repository } from 'typeorm';
// utils
import { createSelectQueryBuilder } from '@utils/database/createQueryBuilder';
// alias
import { COMMON_CODE_TABLE_ALIAS as TABLE_ALIAS } from '@databases/common/table-alias';
// entities
import { CommonCode } from '@databases/entities/common-code.entity';

// ----------------------------------------------------------------------

export async function findSitemapData(
    repository: Repository<CommonCode>,
    options: SqlOptions,
): Promise<Pick<CommonCode, 'value'>[]> {
    const { transaction } = options || {};

    const qb = createSelectQueryBuilder<CommonCode>(CommonCode, TABLE_ALIAS, {
        repository,
        transaction,
    });

    // SELECT
    qb.select(['value']);

    // WHERE
    qb.where("code = 'category'");

    return qb.getRawMany();
}
