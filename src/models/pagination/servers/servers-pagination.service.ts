// @nestjs
import { Injectable } from '@nestjs/common';
// dtos
import { ServerFilterRequestDto } from '@models/servers/dtos';
// services
import { PaginateService } from './services/paginate.service';

// ----------------------------------------------------------------------

@Injectable()
export class ServersPaginationService {
    /**************************************************
     * Constructor
     **************************************************/
    constructor(private readonly paginateService: PaginateService) {}

    /**************************************************
     * Public Methods
     **************************************************/
    /******************************
     * dataService
     ******************************/
    /**
     * 카테고리와 일치한 서버 목록 페이지네이션
     * @param {string} categoryId
     * @param {ServerFilterRequestDto} request
     */
    async categoryServerPaginate(categoryId: number, request: ServerFilterRequestDto) {
        return await this.paginateService.categoryServerPaginate(categoryId, request);
    }

    /**
     * 검색 키워드와 일치한 서버 목록 페이지네이션
     * @param {string} tagName
     * @param {ServerFilterRequestDto} request
     */
    async tagServerPaginate(tagName: string, request: ServerFilterRequestDto) {
        return await this.paginateService.tagServerPaginate(tagName, request);
    }

    /**
     * 검색 키워드와 일치한 서버 목록 페이지네이션
     * @param {string} keyword
     * @param {ServerFilterRequestDto} request
     */
    async searchServerPaginate(keyword: string, request: ServerFilterRequestDto) {
        return await this.paginateService.searchServerPaginate(keyword, request);
    }

    /**
     * 나의 서버 목록 페이지네이션
     * @param {string} userId
     * @param {ServerFilterRequestDto} request
     */
    async myServerPaginate(userId: string, request: ServerFilterRequestDto) {
        return await this.paginateService.myServerPaginate(userId, request);
    }
}
