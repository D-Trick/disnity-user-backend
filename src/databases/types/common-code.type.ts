// types
import type { FindManyOptions, QueryRunner } from 'typeorm';
// entities
import { CommonCode } from '@databases/entities/common-code.entity';

// ----------------------------------------------------------------------

/******************************
 * Find
 ******************************/
export interface CFindOptions extends Omit<FindManyOptions<CommonCode>, 'transaction'> {
    transaction?: QueryRunner;
}
export interface CFindOneOptions extends Omit<FindManyOptions<CommonCode>, 'transaction'> {
    transaction?: QueryRunner;
}
