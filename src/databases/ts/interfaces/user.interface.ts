// types
import type { SqlOptions } from '@common/ts/interfaces/sql-options.interface';
// entities
import { User } from '@databases/entities/user.entity';

// ----------------------------------------------------------------------

/******************************
 * Select
 ******************************/
export interface SelectOptions extends SqlOptions {
    where: {
        id?: string;
        IN?: {
            ids: string[];
        };
    };
}

/******************************
 * DML
 ******************************/
export interface InsertOptions extends SqlOptions {
    values: User | User[];
}
export interface UpdateOptions extends SqlOptions {
    values: Partial<User>;
    where: {
        id: string;
    };
}
export interface BulkUpdateOptions extends SqlOptions {
    values: Partial<User>[];
    where: {
        IN: {
            ids: string[];
        };
        id?: string;
    };
}
