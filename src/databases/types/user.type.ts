// types
import type { SqlOptions } from '@common/types/sql-options.type';
import type { SelectBooleanified } from './global';
// entities
import { User } from '@databases/entities/user.entity';

// ----------------------------------------------------------------------

/******************************
 * Select
 ******************************/
export type SelectSqlName = 'base' | 'columns';

export interface SelectOptions extends SqlOptions {
    select: {
        sql?: {
            base?: boolean;
        };
        columns?: SelectBooleanified<User>;
    };
    where: Partial<Pick<User, 'id'>> & {
        IN?: {
            ids: User['id'][];
        };
    };
}

export interface ReturnSelect {
    base: Pick<
        User,
        | 'id'
        | 'global_name'
        | 'username'
        | 'discriminator'
        | 'email'
        | 'verified'
        | 'avatar'
        | 'locale'
        | 'created_at'
        | 'updated_at'
    >;
    columns: Partial<User>;
}

/******************************
 * DML
 ******************************/
export interface InsertOptions extends SqlOptions {
    values: User | User[];
}
export interface UpdateOptions extends SqlOptions {
    values: Partial<User>;
    where: Partial<Pick<User, 'id'>>;
}
export interface BulkUpdateOptions extends SqlOptions {
    values: Partial<User>[];
    where: Partial<Pick<User, 'id'>> & {
        IN: {
            ids: User['id'][];
        };
    };
}
