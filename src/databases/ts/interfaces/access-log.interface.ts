// types
import type { SqlOptions } from '@common/ts/interfaces/sql-options.interface';
// entities
import { AccessLog } from '@databases/entities/access-log.entity';

// ----------------------------------------------------------------------

/******************************
 * DML
 ******************************/
export interface InsertOptions extends SqlOptions {
    values: AccessLog | AccessLog[];
}
