// types
import { ServersFilterQuery } from '../types/servers-pagination.type';

// ----------------------------------------------------------------------

/**
 * QueryString(page,itemSize, sort, min, max)를 가져와서 DB에 SELECT가능한 포맷형태로 변경
 * @param {SelectFilter} filter
 */
export function filterQueryFormat(filter: ServersFilterQuery) {
    const { page, itemSize, sort, min = 0, max = 0 } = filter || {};

    const paginationFormat = paginationQueryStringFormat(page, itemSize);
    const sortFormat = sortQueryStringFormat(sort);
    const minAndMaxFormat = minAndMaxQueryStringFormat(min, max);

    return {
        page: paginationFormat.page,
        itemSize: paginationFormat.itemSize,

        sort: sortFormat,

        min: minAndMaxFormat.min,
        max: minAndMaxFormat.max,
    };
}

/**
 * pagination을 위한 querystring format
 * @param {number} page
 * @param {number} itemSize
 * @param {number} defaultItemSize?
 */
export function paginationQueryStringFormat(page: number = 0, itemSize: number, defaultItemSize: number = 30) {
    let currentPage = page;
    let currentItemSize = itemSize || defaultItemSize;

    const MIN_ITEM_SIZE = 1;
    const MAX_ITEM_SIZE = 100;

    // 표시 목록 수
    if (currentItemSize < MIN_ITEM_SIZE || currentItemSize > MAX_ITEM_SIZE) {
        currentItemSize = defaultItemSize;
    }

    // 현재 페이지
    if (currentPage > 1) {
        currentPage = (page - 1) * currentItemSize;
    } else {
        currentPage = 0;
    }

    return {
        page: currentPage,
        itemSize: currentItemSize,
    };
}

/**
 * 정렬을 위한 querystring format
 * @param {string} sort
 */
export function sortQueryStringFormat(sort: string = 'refresh') {
    if (sort === 'create') {
        return 'created_at';
    } else if (sort === 'member') {
        return 'member';
    } else {
        return 'refresh_date';
    }
}

/**
 * 멤버수 범위 querystring format
 * @param {number} min
 * @param {number} max
 */
export function minAndMaxQueryStringFormat(min: number = 0, max: number = 0) {
    return {
        min,
        max,
    };
}
