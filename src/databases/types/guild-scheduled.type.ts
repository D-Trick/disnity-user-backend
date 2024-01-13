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
export interface FindThisMonthSchedules {
    id: GuildScheduled['id'];
    name: GuildScheduled['name'];
    image: GuildScheduled['image'];
    description: GuildScheduled['description'];
    scheduled_start_time: GuildScheduled['scheduled_start_time'];
    scheduled_end_time: GuildScheduled['scheduled_end_time'];

    guild_id: Guild['id'];
    guild_name: Guild['name'];
    guild_icon: Guild['icon'];
}

/******************************
 * 쓰기, 수정, 삭제
 ******************************/
export interface InsertOptions extends SqlOptions {
    values: GuildScheduled | GuildScheduled[];
}
export interface UpdateOptions extends SqlOptions {
    values: Partial<GuildScheduled>;
    where: {
        id?: GuildScheduled['id'];
        guild_id?: GuildScheduled['guild_id'];
    };
}
export interface DeleteOptions extends SqlOptions {
    where: {
        id?: GuildScheduled['id'];
        guild_id?: GuildScheduled['guild_id'];
    };
}
