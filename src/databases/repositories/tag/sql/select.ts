// types
import type { SelectQueryBuilder } from 'typeorm';
import type { SelectOptions } from '@databases/types/tag.type';
// lib
import { Repository } from 'typeorm';
// utils
import { createSelectQueryBuilder } from '@databases/utils/createQueryBuilder';
// alias
import { TAG_TABLE_ALIAS as TABLE_ALIAS } from '@databases/common/table-alias';
// entities
import { Tag } from '@databases/entities/tag.entity';

// ----------------------------------------------------------------------
function getSelectColumns(columns: SelectOptions['select']['columns']) {
    const selectColumns = [];

    if (columns?.id) {
        selectColumns.push(`id`);
    }
    if (columns?.guild_id) {
        selectColumns.push(`guild_id`);
    }
    if (columns?.name) {
        selectColumns.push(`name`);
    }
    if (columns?.sort) {
        selectColumns.push(`sort`);
    }

    return selectColumns;
}
// ----------------------------------------------------------------------
function select(qb: SelectQueryBuilder<Tag>, options: SelectOptions) {
    const { select: exclusiveSelect, where } = options || {};
    const { columns } = exclusiveSelect || {};
    const { id, guild_id, name, IN } = where || {};
    const { ids } = IN || {};

    // SELECT
    if (columns) {
        const selectColumns = getSelectColumns(columns);

        qb.select(selectColumns);
    } else {
        throw new Error('[tag/select] Select option Empty');
    }

    // WHERE
    if (id) qb.andWhere('id = :id', { id });
    if (guild_id) qb.andWhere('guild_id = :guild_id', { guild_id });
    if (name) qb.andWhere('name = :name', { name });
    if (ids) qb.andWhere('id IN (:ids)', { ids });

    return qb;
}
// ----------------------------------------------------------------------

export async function selectOne(repository: Repository<Tag>, options: SelectOptions): Promise<Partial<Tag>> {
    const { transaction } = options || {};

    const qb = createSelectQueryBuilder<Tag>(Tag, TABLE_ALIAS, {
        repository,
        transaction,
    });

    return select(qb, options).getRawOne();
}

export async function selectMany(repository: Repository<Tag>, options: SelectOptions): Promise<Partial<Tag>[]> {
    const { transaction } = options || {};

    const qb = createSelectQueryBuilder<Tag>(Tag, TABLE_ALIAS, {
        repository,
        transaction,
    });

    return select(qb, options).getRawMany();
}
