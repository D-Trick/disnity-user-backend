// types
import type { SelectFilter } from '@common/types/select-filter.type';
// @nestjs
import { Injectable } from '@nestjs/common';
// helpers
import { PaginationHelper } from '../helpers/pagination.helper';
// repositories
import { CommonCodeRepository } from '@databases/repositories/common-code';

// ----------------------------------------------------------------------

@Injectable()
export class ServersDataService {
    /**************************************************
     * Constructor
     **************************************************/
    constructor(
        private readonly paginationHelper: PaginationHelper,
        private readonly commonCodeRepository: CommonCodeRepository,
    ) {}

    /**************************************************
     * Public Methods
     **************************************************/
    /**
     * 서버 전체 목록 가져오기
     * @param {SelectFilter} filter
     */
    async getAllServers(filter: SelectFilter) {
        const promise1 = this.commonCodeRepository.selectOne({
            select: {
                columns: {
                    name: true,
                },
            },
            where: {
                code: 'category',
                value: 'all',
            },
        });
        const promise2 = this.paginationHelper.categoryServerPaginate({
            filter,
        });
        const [category, servers] = await Promise.all([promise1, promise2]);

        return {
            categoryName: category?.name || '',
            ...servers,
        };
    }

    /**
     * 카테고리에 해당하는 서버 목록 가져오기
     * @param {number} categoryId
     * @param {SelectFilter} filter
     */
    async getCategoryServers(categoryId: number, filter: SelectFilter) {
        const promise1 = this.commonCodeRepository.selectOne({
            select: {
                columns: {
                    name: true,
                },
            },
            where: {
                code: 'category',
                value: String(categoryId),
            },
        });
        const promise2 = this.paginationHelper.categoryServerPaginate({
            categoryId,
            filter,
        });
        const [category, servers] = await Promise.all([promise1, promise2]);

        return {
            categoryName: category?.name || '',
            ...servers,
        };
    }

    /**
     * 태그명에 해당하는 서버 목록 가져오기
     * @param {string} tagName
     * @param {SelectFilter} filter
     */
    async getTagServers(tagName: string, filter: SelectFilter) {
        const servers = await this.paginationHelper.tagServerPaginate({
            tagName,
            filter,
        });

        return {
            tagName,
            ...servers,
        };
    }

    /**
     * 검색 키워드와 일치한 서버 목록 가져오기
     * @param {string} keyword
     * @param {SelectFilter} filter
     */
    async getSearchServers(keyword: string, filter: SelectFilter) {
        const servers = await this.paginationHelper.searchServerPaginate({
            keyword,
            filter,
        });

        return {
            ...servers,
            keyword,
        };
    }

    /**
     * 나의 서버 목록 가져오기
     * @param {string} userId
     * @param {SelectFilter} filter
     */
    async getMyServers(userId: string, filter: SelectFilter) {
        const servers = await this.paginationHelper.myServerPaginate({
            userId,
            filter,
        });

        return servers;
    }
}
