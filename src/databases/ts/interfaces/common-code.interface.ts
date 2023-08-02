// types
import type { SqlOptions } from '@common/ts/interfaces/sql-options.interface';

// ----------------------------------------------------------------------

/******************************
 * Select
 ******************************/
export interface SelectOptions extends SqlOptions {
    where: {
        code: string;
        value?: string | number;
    };
}
