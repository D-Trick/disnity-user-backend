// types
import type { SelectBooleanified } from './global';
import type { SqlOptions } from '@common/types/sql-options.type';
// entities
import { Tag } from '@databases/entities/tag.entity';

// ----------------------------------------------------------------------

/******************************
 * Select
 ******************************/
export interface SelectOptions extends SqlOptions {
    select: {
        columns?: SelectBooleanified<Tag>;
    };

    where: Partial<Pick<Tag, 'id' | 'guild_id' | 'name'>> & {
        IN?: {
            ids: Tag['id'][];
        };
    };
}

export interface ReturnSelect {
    columns: Partial<Tag>;
}

/******************************
 * FindNames
 ******************************/
export interface FindNames extends Pick<Tag, 'name'> {
    total: number;
}

/******************************
 * TotalTagGuildsCount
 ******************************/
export interface TotalTagGuildsCountOptions extends SqlOptions {
    where: {
        tag_name: Tag['name'];
        min?: number;
        max?: number;
    };
}

/******************************
 * FindTagGuildIds
 ******************************/
export interface FindTagGuildIdsOptions extends SqlOptions {
    where?: {
        tag_name: Tag['name'];
        min?: number;
        max?: number;
    };

    orderBy?: {
        sort?: string;
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
    where: Partial<Pick<Tag, 'id' | 'guild_id'>>;
}
export interface DeleteOptions extends SqlOptions {
    where: Partial<Pick<Tag, 'id' | 'guild_id'>>;
}
