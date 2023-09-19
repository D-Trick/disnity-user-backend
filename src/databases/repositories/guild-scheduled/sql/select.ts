// types
import type { SelectQueryBuilder } from 'typeorm';
import type { SelectOptions } from '@databases/types/guild-scheduled.type';
// lib
import { Repository } from 'typeorm';
// utils
import { createSelectQueryBuilder } from '@databases/utils/createQueryBuilder';
// alias
import { GUILD_SCHEDULED_TABLE_ALIAS as TABLE_ALIAS } from '@databases/common/table-alias';
// entities
import { GuildScheduled } from '@databases/entities/guild-scheduled.entity';

// ----------------------------------------------------------------------
function getSelectColumns(columns: SelectOptions['select']['columns']) {
    const selectColumns = [];

    if (columns?.id) {
        selectColumns.push('id');
    }
    if (columns?.guild_id) {
        selectColumns.push('guild_id');
    }
    if (columns?.channel_id) {
        selectColumns.push('channel_id');
    }
    if (columns?.creator_id) {
        selectColumns.push('creator_id');
    }
    if (columns?.name) {
        selectColumns.push('name');
    }
    if (columns?.description) {
        selectColumns.push('description');
    }
    if (columns?.scheduled_start_time) {
        selectColumns.push(`DATE_FORMAT(scheduled_start_time, '%Y-%m-%d %H:%i') AS scheduled_start_time`);
    }
    if (columns?.scheduled_end_time) {
        selectColumns.push(`DATE_FORMAT(scheduled_end_time, '%Y-%m-%d %H:%i')   AS scheduled_end_time`);
    }
    if (columns?.privacy_level) {
        selectColumns.push('privacy_level');
    }
    if (columns?.status) {
        selectColumns.push('status');
    }
    if (columns?.entity_type) {
        selectColumns.push('entity_type');
    }
    if (columns?.entity_id) {
        selectColumns.push('entity_id');
    }
    if (columns?.entity_metadata) {
        selectColumns.push('entity_metadata');
    }
    if (columns?.user_count) {
        selectColumns.push('user_count');
    }
    if (columns?.image) {
        selectColumns.push('image');
    }

    return selectColumns;
}
// ----------------------------------------------------------------------
function select(qb: SelectQueryBuilder<GuildScheduled>, options: SelectOptions) {
    const { select: exclusiveSelect, where } = options || {};
    const { columns } = exclusiveSelect || {};
    const { id, guild_id, channel_id } = where || {};

    // SELECT
    if (columns) {
        const selectColumns = getSelectColumns(columns);

        qb.select(selectColumns);
    } else {
        throw new Error('[guildsScheduled/select] Select option Empty');
    }

    // WHERE
    if (id) qb.andWhere('id = :id', { id });
    if (guild_id) qb.andWhere('guild_id = :guild_id', { guild_id });
    if (channel_id) qb.andWhere('channel_id = :channel_id', { channel_id });

    return qb;
}
// ----------------------------------------------------------------------

export async function selectOne(
    repository: Repository<GuildScheduled>,
    options: SelectOptions,
): Promise<Partial<GuildScheduled>> {
    const { transaction } = options || {};

    const qb = createSelectQueryBuilder<GuildScheduled>(GuildScheduled, TABLE_ALIAS, {
        repository,
        transaction,
    });

    return select(qb, options).getRawOne();
}

export async function selectMany(
    repository: Repository<GuildScheduled>,
    options: SelectOptions,
): Promise<Partial<GuildScheduled>[]> {
    const { transaction } = options || {};

    const qb = createSelectQueryBuilder<GuildScheduled>(GuildScheduled, TABLE_ALIAS, {
        repository,
        transaction,
    });

    return select(qb, options).getRawMany();
}
