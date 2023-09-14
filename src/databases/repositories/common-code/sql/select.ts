// types
import type { SelectOptions } from '@databases/types/common-code.type';
import type { SelectQueryBuilder } from 'typeorm';
// lib
import { Repository } from 'typeorm';
// utils
import { createSelectQueryBuilder } from '@databases/utils/createQueryBuilder';
// alias
import { COMMON_CODE_TABLE_ALIAS as TABLE_ALIAS } from '@databases/common/table-alias';
// entities
import { CommonCode } from '@databases/entities/common-code.entity';

// ----------------------------------------------------------------------
function getSelectColumns(columns: SelectOptions['select']['columns']) {
    const selectColumns = [];

    if (columns?.id) {
        selectColumns.push(`${TABLE_ALIAS}.id AS id`);
    }

    if (columns?.code) {
        selectColumns.push(`${TABLE_ALIAS}.code AS code`);
    }

    if (columns?.value) {
        selectColumns.push(`${TABLE_ALIAS}.value AS value`);
    }

    if (columns?.name) {
        selectColumns.push(`${TABLE_ALIAS}.name AS name`);
    }

    if (columns?.created_at) {
        selectColumns.push(`DATE_FORMAT(${TABLE_ALIAS}.created_at, '%Y-%m-%d %H:%i:%S') AS created_at`);
    }

    if (columns?.created_admin_id) {
        selectColumns.push(`${TABLE_ALIAS}.created_admin_id AS created_admin_id`);
    }

    if (columns?.updated_at) {
        selectColumns.push(`DATE_FORMAT(${TABLE_ALIAS}.updated_at, '%Y-%m-%d %H:%i:%S') AS updated_at`);
    }

    if (columns?.updated_admin_id) {
        selectColumns.push(`${TABLE_ALIAS}.updated_admin_id AS updated_admin_id`);
    }

    return selectColumns;
}
// ----------------------------------------------------------------------
function select(qb: SelectQueryBuilder<CommonCode>, options: SelectOptions) {
    const { select: exclusiveSelect, where } = options || {};
    const { columns } = exclusiveSelect || {};
    const { code, value } = where || {};

    // SELECT
    if (columns) {
        const selectColumns = getSelectColumns(columns);

        qb.select(selectColumns);
    } else {
        throw new Error('[common-code/select] Select option Empty');
    }

    // WHERE
    if (code) qb.andWhere('code = :code', { code });
    if (value) qb.andWhere('value = :value', { value });

    return qb;
}
// ----------------------------------------------------------------------

export async function selectOne(
    repository: Repository<CommonCode>,
    options: SelectOptions,
): Promise<Partial<CommonCode>> {
    const { transaction } = options || {};

    const qb = createSelectQueryBuilder<CommonCode>(CommonCode, TABLE_ALIAS, {
        repository,
        transaction,
    });

    return select(qb, options).getRawOne();
}

export async function selectMany(
    repository: Repository<CommonCode>,
    options: SelectOptions,
): Promise<Partial<CommonCode>[]> {
    const { transaction } = options || {};

    const qb = createSelectQueryBuilder<CommonCode>(CommonCode, TABLE_ALIAS, {
        repository,
        transaction,
    });

    return select(qb, options).getRawMany();
}
