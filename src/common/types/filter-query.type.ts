export interface PaginationQuery {
    page?: number;
    itemSize?: number;
}

export interface SortQuery {
    sort?: string;
}

export interface MemberCountRangeQuery {
    min?: number;
    max?: number;
}
