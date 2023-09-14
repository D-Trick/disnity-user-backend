// types
import type { SqlOptions } from '@common/types/sql-options.type';
import type { SelectBooleanified } from './global';
// entities
import { Emoji } from '@databases/entities/emoji.entity';

// ----------------------------------------------------------------------

/******************************
 * Select
 ******************************/
export interface SelectOptions extends SqlOptions {
    select: {
        // sql: {};
        columns: SelectBooleanified<Emoji>;
    };
    where?: Partial<Pick<Emoji, 'guild_id' | 'animated'>>;
}

/******************************
 * DML
 ******************************/
export interface InsertOptions extends SqlOptions {
    values: Emoji | Emoji[];
}
export interface UpdateOptions extends SqlOptions {
    values: Partial<Emoji>;
    where: Partial<Pick<Emoji, 'id' | 'guild_id'>>;
}
export interface DeleteOptions extends SqlOptions {
    where: Partial<Pick<Emoji, 'id' | 'guild_id'>>;
}
