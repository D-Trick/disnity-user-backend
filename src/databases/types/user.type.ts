// types
import type { SqlOptions } from '@common/types/sql-options.type';
// lib
import { FindManyOptions, FindOneOptions, QueryRunner } from 'typeorm';
// entities
import { User } from '@databases/entities/user.entity';

// ----------------------------------------------------------------------

/******************************
 * Find
 ******************************/
export type SelectType = 'basic' | 'frequentlyUsed';

export interface CFindOptions extends Omit<FindManyOptions<User>, 'transaction'> {
    transaction?: QueryRunner;
    preSelect?: {
        frequentlyUsed?: boolean;
    };
}
export interface CFindOneOptions extends Omit<FindOneOptions<User>, 'transaction'> {
    transaction?: QueryRunner;
    preSelect?: {
        frequentlyUsed?: boolean;
    };
}
export interface ReturnCFind {
    basic: User[];
    frequentlyUsed: Pick<
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
    >[];
}
export interface ReturnCFindOne {
    basic: User;
    frequentlyUsed: Pick<
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
