// types
import type { SqlOptions } from '@common/types/sql-options.type';
// entities
import { AccessLog } from '@databases/entities/access-log.entity';

// ----------------------------------------------------------------------

/******************************
 * DML
 ******************************/
export interface InsertOptions extends SqlOptions {
    values: AccessLog | AccessLog[];
}
