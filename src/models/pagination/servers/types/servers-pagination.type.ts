// types
import type { MemberCountRangeQuery, PaginationQuery, SortQuery } from '@common/types/filter-query.type';
// entities
import type { User } from '@databases/entities/user.entity';

// ----------------------------------------------------------------------

interface CommonOptions {
    filterQuery: ServersFilterQuery;
}

export type ServersFilterQuery = PaginationQuery & SortQuery & MemberCountRangeQuery;

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
