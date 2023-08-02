// types
import type { SqlOptions } from '@common/ts/interfaces/sql-options.interface';
import type { min, max, sort } from '@common/ts/interfaces/select-filter.interface';
// entities
import { Tag } from '@databases/entities/tag.entity';

// ----------------------------------------------------------------------

/******************************
 * FindAll
 ******************************/
export interface FindAll extends Pick<Tag, 'name'> {
    total: number;
}

/******************************
 * ServerTotalCount
 ******************************/
export interface ServerTotalCountOptions extends SqlOptions {
    where?: {
        tag_name: string;
        min?: min;
        max?: max;
    };
}

/******************************
 * FindMany
 ******************************/
export interface FindManyOptions extends SqlOptions {
    where?: {
        tag_name: string;
        min?: min;
        max?: max;
    };

    orderBy?: {
        sort?: sort;
    };
}

/******************************
 * DML
 ******************************/
export interface InsertOptions extends SqlOptions {
    values: Tag | Tag[];
}
export interface UpdateOptions extends SqlOptions {
    values: Partial<Tag>;
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
