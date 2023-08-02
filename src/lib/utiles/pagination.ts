import type { SelectFilter } from '@common/ts/interfaces/select-filter.interface';

export function pagination(page: number, itemSize: number, defaultItemSize = 30): SelectFilter {
    // 현재 페이지
    page = page > 1 ? (page - 1) * (itemSize || defaultItemSize) : 0;

    // 표시할 목록 수
    itemSize = itemSize >= 100 || itemSize < 1 ? defaultItemSize : itemSize || defaultItemSize;

    return {
        page,
        itemSize,
    };
}
