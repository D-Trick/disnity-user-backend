// types
import type { SqlOptions } from '@common/ts/interfaces/sql-options.interface';
// entities
import { GuildScheduled } from '@databases/entities/guild-scheduled.entity';

// ----------------------------------------------------------------------

/******************************
 * Select
 ******************************/
export interface Select
    extends Pick<
        GuildScheduled,
        'id' | 'name' | 'description' | 'scheduled_start_time' | 'scheduled_end_time' | 'image'
    > {
    guild_id: string;
    guild_name: string;
    guild_icon: string;
}

export interface SelectOptions extends SqlOptions {
    where?: {
        scheduled_start_time?: string;
        scheduled_end_time?: string;
    };
}

/******************************
 * DML
 ******************************/
export interface InsertOptions extends SqlOptions {
    values: GuildScheduled | GuildScheduled[];
}
export interface UpdateOptions extends SqlOptions {
    values: Partial<GuildScheduled>;
    where: {
        id?: string;
        guild_id?: string;
    };
}
export interface DeleteOptions extends SqlOptions {
    where: {
        id?: string;
        guild_id?: string;
    };
}
