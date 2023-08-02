// types
import type { SelectFilter } from '@common/ts/interfaces/select-filter.interface';

// ----------------------------------------------------------------------

export interface FindOptions {
    listType?: string;
    userId?: string;
    filter: SelectFilter;
    keyword?: string;
    tagName?: string;
    categoryId?: number;
}
