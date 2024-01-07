// types
import type { SqlOptions } from '@common/types/sql-options.type';
// lib
import { FindManyOptions, QueryRunner } from 'typeorm';
// entities
import { Guild } from '@databases/entities/guild.entity';
import { GuildScheduled } from '@databases/entities/guild-scheduled.entity';

// ----------------------------------------------------------------------

/******************************
 * Find
 ******************************/
export interface CFindOptions extends Omit<FindManyOptions<GuildScheduled>, 'transaction'> {
    transaction?: QueryRunner;
}
export interface CFindOneOptions extends Omit<FindManyOptions<GuildScheduled>, 'transaction'> {
    transaction?: QueryRunner;
}

/******************************
 * FindThisMonthSchedules
 ******************************/
export interface FindThisMonthSchedules
    extends Pick<
        GuildScheduled,
        'id' | 'name' | 'description' | 'scheduled_start_time' | 'scheduled_end_time' | 'image'
    > {
    guild_id: Guild['id'];
    guild_name: Guild['name'];
    guild_icon: Guild['icon'];
}

/******************************
 * DML
 ******************************/
export interface InsertOptions extends SqlOptions {
    values: GuildScheduled | GuildScheduled[];
}
export interface UpdateOptions extends SqlOptions {
    values: Partial<GuildScheduled>;
    where: Partial<Pick<GuildScheduled, 'id' | 'guild_id'>>;
}
export interface DeleteOptions extends SqlOptions {
    where: Partial<Pick<GuildScheduled, 'id' | 'guild_id'>>;
}
