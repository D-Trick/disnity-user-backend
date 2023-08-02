// types
import type { SqlOptions } from '@common/ts/interfaces/sql-options.interface';

// ----------------------------------------------------------------------

/******************************
 * FindByType
 ******************************/
export interface FindByTypeOptions extends SqlOptions {
    where: {
        type: string;
    };
}
