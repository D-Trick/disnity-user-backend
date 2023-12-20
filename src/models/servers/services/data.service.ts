// types
import type { ServersFilterQuery } from '@models/pagination/servers/types/servers-pagination.type';
// @nestjs
import { Injectable } from '@nestjs/common';
// services
import { ServersPaginationService } from '@models/pagination/servers/servers-pagination.service';
// repositories
import { CommonCodeRepository } from '@databases/repositories/common-code';

// ----------------------------------------------------------------------

@Injectable()
export class ServersDataService {
    /**************************************************
     * Constructor
     **************************************************/
    constructor(
        private readonly serversPaginationService: ServersPaginationService,

        private readonly commonCodeRepository: CommonCodeRepository,
    ) {}

    /**************************************************
     * Public Methods
     **************************************************/
    /**
     * 서버 전체 목록 가져오기
     * @param {ServersFilterQuery} filterQuery
     */
    async getAllServers(filterQuery: ServersFilterQuery) {
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
        const promise2 = this.serversPaginationService.categoryServerPaginate({
            filterQuery,
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
     * @param {ServersFilterQuery} filterQuery
     */
    async getCategoryServers(categoryId: number, filterQuery: ServersFilterQuery) {
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
        const promise2 = this.serversPaginationService.categoryServerPaginate({
            categoryId,
            filterQuery,
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
     * @param {ServersFilterQuery} filterQuery
     */
    async getTagServers(tagName: string, filterQuery: ServersFilterQuery) {
        const servers = await this.serversPaginationService.tagServerPaginate({
            tagName,
            filterQuery,
        });

        return {
            tagName,
            ...servers,
        };
    }

    /**
     * 검색 키워드와 일치한 서버 목록 가져오기
     * @param {string} keyword
     * @param {ServersFilterQuery} filterQuery
     */
    async getSearchServers(keyword: string, filterQuery: ServersFilterQuery) {
        const servers = await this.serversPaginationService.searchServerPaginate({
            keyword,
            filterQuery,
        });

        return {
            ...servers,
            keyword,
        };
    }

    /**
     * 나의 서버 목록 가져오기
     * @param {string} userId
     * @param {ServersFilterQuery} filterQuery
     */
    async getMyServers(userId: string, filterQuery: ServersFilterQuery) {
        const servers = await this.serversPaginationService.myServerPaginate({
            userId,
            filterQuery,
        });

        return servers;
    }
}
