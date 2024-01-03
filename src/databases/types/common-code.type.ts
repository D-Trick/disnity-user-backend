// types
import type { FindManyOptions, FindOneOptions } from 'typeorm';
import type { SqlOptions } from '@common/types/sql-options.type';
// entities
import { CommonCode } from '@databases/entities/common-code.entity';

// ----------------------------------------------------------------------

/******************************
 * Select
 ******************************/
export type CFindOptions = SqlOptions & FindManyOptions<CommonCode>;
export type CFindOneOptions = SqlOptions & FindOneOptions<CommonCode>;
