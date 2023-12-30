// lib
import { IsInt, IsOptional, Max } from 'class-validator';
// messages
import { HTTP_ERROR_MESSAGES } from '@common/messages';

// ----------------------------------------------------------------------

export class PaginationDtoRequest {
    @Max(4200000000, { message: HTTP_ERROR_MESSAGES['900'] })
    @IsInt({ message: HTTP_ERROR_MESSAGES['900'] })
    @IsOptional()
    page?: number;

    @Max(4200000000, { message: HTTP_ERROR_MESSAGES['900'] })
    @IsInt({ message: HTTP_ERROR_MESSAGES['900'] })
    @IsOptional()
    itemSize?: number;

    /**
     * DB에 Pagination을 위한 limit, offset을 반환합니다.
     * @param {number} defaultItemSize
     */
    toPagination(defaultItemSize: number = 30): { limit: number; offset: number } {
        let currentPage = this.page;
        let currentItemSize = this.itemSize || defaultItemSize;

        const MIN_ITEM_SIZE = 1;
        const MAX_ITEM_SIZE = 100;

        // 표시 목록 수
        if (currentItemSize < MIN_ITEM_SIZE || currentItemSize > MAX_ITEM_SIZE) {
            currentItemSize = defaultItemSize;
        }

        // 현재 페이지
        if (currentPage > 1) {
            currentPage = (currentPage - 1) * currentItemSize;
        } else {
            currentPage = 0;
        }

        return {
            limit: currentItemSize,
            offset: currentPage,
        };
    }
}
