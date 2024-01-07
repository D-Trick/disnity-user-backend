// types
import type { SqlOptions } from '@common/types/sql-options.type';
// lib
import { FindManyOptions, QueryRunner } from 'typeorm';
// entities
import { Emoji } from '@databases/entities/emoji.entity';

// ----------------------------------------------------------------------

/******************************
 * Find
 ******************************/
export interface CFindOptions extends Omit<FindManyOptions<Emoji>, 'transaction'> {
    transaction?: QueryRunner;
}
export interface CFindOneOptions extends Omit<FindManyOptions<Emoji>, 'transaction'> {
    transaction?: QueryRunner;
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
