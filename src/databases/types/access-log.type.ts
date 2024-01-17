// types
import type { SqlOptions } from '@common/types/sql-options.type';
// entities
import { AccessLog } from '@databases/entities/access-log.entity';

// ----------------------------------------------------------------------

/******************************
 * 쓰기, 수정, 삭제
 ******************************/
export interface InsertOptions extends SqlOptions {
    values: AccessLog | AccessLog[];
}
