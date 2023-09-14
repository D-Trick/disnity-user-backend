export type sort = string;
export type min = number;
export type max = number;

export interface SelectFilter {
    page?: number;
    itemSize?: number;
    sort?: sort;
    min?: min;
    max?: max;
}
