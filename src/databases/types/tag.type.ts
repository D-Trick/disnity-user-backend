// types
import type { SqlOptions } from '@common/types/sql-options.type';
// lib
import { FindManyOptions, QueryRunner } from 'typeorm';
// entities
import { Tag } from '@databases/entities/tag.entity';

// ----------------------------------------------------------------------

/******************************
 * Find
 ******************************/
export interface CFindOptions extends Omit<FindManyOptions<Tag>, 'transaction'> {
    transaction?: QueryRunner;
}
export interface CFindOneOptions extends Omit<FindManyOptions<Tag>, 'transaction'> {
    transaction?: QueryRunner;
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
