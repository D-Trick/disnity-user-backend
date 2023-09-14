// types
import type { SelectQueryBuilder } from 'typeorm';
import type { ReturnSelect, SelectOptions, SelectSqlName } from '@databases/types/user.type';
// lib
import { Repository } from 'typeorm';
// utils
import { createSelectQueryBuilder } from '@databases/utils/createQueryBuilder';
// alias
import { USER_TABLE_ALIAS as TABLE_ALIAS } from '@databases/common/table-alias';
// entities
import { User } from '@databases/entities/user.entity';

// ----------------------------------------------------------------------
const selectBaseUser = [
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
];
// ----------------------------------------------------------------------
function getSelectColumns(columns: SelectOptions['select']['columns']) {
    const selectColumns = [];

    if (columns?.id) {
        selectColumns.push('id');
    }
    if (columns?.global_name) {
        selectColumns.push('global_name');
    }
    if (columns?.username) {
        selectColumns.push('username');
    }
    if (columns?.discriminator) {
        selectColumns.push('discriminator');
    }
    if (columns?.email) {
        selectColumns.push('email');
    }
    if (columns?.verified) {
        selectColumns.push('verified');
    }
    if (columns?.avatar) {
        selectColumns.push('avatar');
    }
    if (columns?.banner) {
        selectColumns.push('banner');
    }
    if (columns?.locale) {
        selectColumns.push('locale');
    }
    if (columns?.premium_type) {
        selectColumns.push('premium_type');
    }
    if (columns?.created_at) {
        selectColumns.push(`DATE_FORMAT(created_at, '%Y-%m-%d %H:%i')   AS created_at`);
    }
    if (columns?.updated_at) {
        selectColumns.push(`DATE_FORMAT(updated_at, '%Y-%m-%d %H:%i')   AS updated_at`);
    }

    return selectColumns;
}
// ----------------------------------------------------------------------
function select(qb: SelectQueryBuilder<User>, options: SelectOptions) {
    const { select: exclusiveSelect, where } = options || {};
    const { sql, columns } = exclusiveSelect || {};
    const { id, IN } = where || {};
    const { ids } = IN || {};

    // SELECT
    if (sql) {
        const { base } = sql || {};

        if (base) qb.select(selectBaseUser);
    } else if (columns) {
        const selectColumns = getSelectColumns(columns);

        qb.select(selectColumns);
    } else {
        throw new Error('[user/select] Select option Empty');
    }

    // WHERE
    if (id) qb.where('id = :id', { id });
    if (ids) qb.where('id IN (:ids)', { ids });

    return qb;
}
// ----------------------------------------------------------------------

export async function selectOne<T extends SelectSqlName = 'columns'>(
    repository: Repository<User>,
    options: SelectOptions,
): Promise<ReturnSelect[T]> {
    const { transaction } = options || {};

    const qb = createSelectQueryBuilder<User>(User, TABLE_ALIAS, {
        repository,
        transaction,
    });

    return select(qb, options).getRawOne();
}

export async function selectMany<T extends SelectSqlName = 'columns'>(
    repository: Repository<User>,
    options: SelectOptions,
): Promise<ReturnSelect[T][]> {
    const { transaction } = options || {};

    const qb = createSelectQueryBuilder<User>(User, TABLE_ALIAS, {
        repository,
        transaction,
    });

    return select(qb, options).getRawMany();
}
