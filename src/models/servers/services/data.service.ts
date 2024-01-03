// @nestjs
import { Injectable } from '@nestjs/common';
// dtos
import { ServerFilterRequestDto } from '../dtos';
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
     * @param {ServerFilterRequestDto} request
     */
    async getAllServers(request: ServerFilterRequestDto) {
        const promise1 = this.commonCodeRepository.findOne({
            select: {
                name: true,
            },
            where: {
                code: 'category',
                value: 'all',
            },
        });
        const promise2 = this.serversPaginationService.categoryServerPaginate(0, request);
        const [category, servers] = await Promise.all([promise1, promise2]);

        return {
            categoryName: category?.name || '',
            ...servers,
        };
    }

    /**
     * 카테고리에 해당하는 서버 목록 가져오기
     * @param {number} categoryId
     * @param {ServerFilterRequestDto} request
     */
    async getCategoryServers(categoryId: number, request: ServerFilterRequestDto) {
        const promise1 = this.commonCodeRepository.findOne({
            select: {
                name: true,
            },
            where: {
                code: 'category',
                value: String(categoryId),
            },
        });
        const promise2 = this.serversPaginationService.categoryServerPaginate(categoryId, request);
        const [category, servers] = await Promise.all([promise1, promise2]);

        return {
            categoryName: category?.name || '',
            ...servers,
        };
    }

    /**
     * 태그명에 해당하는 서버 목록 가져오기
     * @param {string} tagName
     * @param {ServerFilterRequestDto} request
     */
    async getTagServers(tagName: string, request: ServerFilterRequestDto) {
        const servers = await this.serversPaginationService.tagServerPaginate(tagName, request);

        return {
            tagName,
            ...servers,
        };
    }

    /**
     * 검색 키워드와 일치한 서버 목록 가져오기
     * @param {string} keyword
     * @param {ServerFilterRequestDto} request
     */
    async getSearchServers(keyword: string, request: ServerFilterRequestDto) {
        const servers = await this.serversPaginationService.searchServerPaginate(keyword, request);

        return {
            ...servers,
            keyword,
        };
    }

    /**
     * 나의 서버 목록 가져오기
     * @param {string} userId
     * @param {ServerFilterRequestDto} request
     */
    async getMyServers(userId: string, request: ServerFilterRequestDto) {
        const servers = await this.serversPaginationService.myServerPaginate(userId, request);

        return servers;
    }
}
