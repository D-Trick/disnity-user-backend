// entities
import { CommonCode } from '@databases/entities/common-code.entity';

// ----------------------------------------------------------------------

/******************************
 * Select
 ******************************/
export type Select = Pick<CommonCode, 'id' | 'name' | 'value'>;
