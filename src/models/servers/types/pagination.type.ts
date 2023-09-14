// types
import type { SelectFilter } from '@common/types/select-filter.type';
import type { User } from '@databases/entities/user.entity';

// ----------------------------------------------------------------------

export interface PaginateOptions {
    listType: 'my-server' | 'category-server' | 'tag-server' | 'search-server';
    userId?: User['id'];
    filter: SelectFilter;
    keyword?: string;
    tagName?: string;
    categoryId?: number;
}
