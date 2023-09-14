// types
import type { SqlOptions } from '@common/types/sql-options.type';
import type { min, max, sort } from '@common/types/select-filter.type';
// entities
import { Tag } from '@databases/entities/tag.entity';

// ----------------------------------------------------------------------

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
        min?: min;
        max?: max;
    };
}

/******************************
 * FindTagGuildIds
 ******************************/
export interface FindTagGuildIdsOptions extends SqlOptions {
    where?: {
        tag_name: Tag['name'];
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
    where: Partial<Pick<Tag, 'id' | 'guild_id'>>;
}
export interface DeleteOptions extends SqlOptions {
    where: Partial<Pick<Tag, 'id' | 'guild_id'>>;
}