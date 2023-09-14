// types
import type { SqlOptions } from '@common/types/sql-options.type';
import type { SelectBooleanified } from './global';
// entities
import { CommonCode } from '@databases/entities/common-code.entity';

// ----------------------------------------------------------------------

/******************************
 * Select
 ******************************/
export interface SelectOptions extends SqlOptions {
    select: {
        //sql?: {};
        columns: SelectBooleanified<CommonCode>;
    };
    where?: Partial<Pick<CommonCode, 'code' | 'value'>>;
}
