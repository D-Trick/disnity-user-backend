// types
import type { SqlOptions } from '@common/ts/interfaces/sql-options.interface';
// entities
import { Emoji } from '@databases/entities/emoji.entity';

// ----------------------------------------------------------------------

/******************************
 * Select
 ******************************/
export interface SelectOptions extends SqlOptions {
    where?: {
        guild_id?: string;
        animated?: number;
    };
}

/******************************
 * DML
 ******************************/
export interface InsertOptions extends SqlOptions {
    values: Emoji | Emoji[];
}
export interface UpdateOptions extends SqlOptions {
    values: Partial<Emoji>;
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
