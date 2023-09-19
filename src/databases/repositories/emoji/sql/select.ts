// types
import type { SelectQueryBuilder } from 'typeorm';
import type { SelectOptions } from '@databases/types/emoji.type';
// lib
import { Repository } from 'typeorm';
// utils
import { isBooleanType } from '@utils/is-boolean-type';
import { createSelectQueryBuilder } from '@databases/utils/createQueryBuilder';
// alias
import { EMOJI_TABLE_ALIAS as TABLE_ALIAS } from '@databases/common/table-alias';
// entities
import { Emoji } from '@databases/entities/emoji.entity';

// ----------------------------------------------------------------------
function getSelectColumns(columns: SelectOptions['select']['columns']) {
    const selectColumns = [];

    if (columns?.id) {
        selectColumns.push(`${TABLE_ALIAS}.id AS id`);
    }

    if (columns?.guild_id) {
        selectColumns.push(`${TABLE_ALIAS}.guild_id AS guild_id`);
    }

    if (columns?.name) {
        selectColumns.push(`${TABLE_ALIAS}.name AS name`);
    }

    if (columns?.animated) {
        selectColumns.push(`${TABLE_ALIAS}.animated AS animated`);
    }

    return selectColumns;
}
// ----------------------------------------------------------------------
function select(qb: SelectQueryBuilder<Emoji>, options: SelectOptions) {
    const { select: exclusiveSelect, where } = options || {};
    const { columns } = exclusiveSelect || {};
    const { guild_id, animated } = where || {};

    // SELECT
    if (columns) {
        const selectColumns = getSelectColumns(columns);

        qb.select(selectColumns);
    } else {
        throw new Error('[emoji/select] Select option Empty');
    }

    // WHERE
    if (guild_id) qb.where('guild_id = :guild_id', { guild_id });
    if (isBooleanType(animated)) qb.andWhere('animated = :animated', { animated });

    return qb;
}
// ----------------------------------------------------------------------

export async function selectOne(repository: Repository<Emoji>, options: SelectOptions): Promise<Partial<Emoji>> {
    const { transaction } = options || {};

    const qb = createSelectQueryBuilder<Emoji>(Emoji, TABLE_ALIAS, {
        repository,
        transaction,
    });

    return select(qb, options).getRawOne();
}

export async function selectMany(repository: Repository<Emoji>, options: SelectOptions): Promise<Partial<Emoji>[]> {
    const { transaction } = options || {};

    const qb = createSelectQueryBuilder<Emoji>(Emoji, TABLE_ALIAS, {
        repository,
        transaction,
    });

    return select(qb, options).getRawMany();
}
