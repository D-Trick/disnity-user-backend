// types
import type { SelectFilter } from '@common/types/select-filter.type';
import type { User } from '@databases/entities/user.entity';

// ----------------------------------------------------------------------

interface CommonOptions {
    filter: SelectFilter;
}

export interface CategoryServerPaginateOptions extends CommonOptions {
    categoryId?: number;
}

export interface TagServerPaginateOptions extends CommonOptions {
    tagName: string;
}

export interface SearchServerPaginateOptions extends CommonOptions {
    keyword: string;
}

export interface MyServerPaginateOptions extends CommonOptions {
    userId: User['id'];
}
