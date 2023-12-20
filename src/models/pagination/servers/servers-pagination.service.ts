// types
import type {
    MyServerPaginateOptions,
    TagServerPaginateOptions,
    SearchServerPaginateOptions,
    CategoryServerPaginateOptions,
} from './types/servers-pagination.type';
// @nestjs
import { Injectable } from '@nestjs/common';
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
     * @param {CategoryServerPaginateOptions} options
     */
    async categoryServerPaginate(options: CategoryServerPaginateOptions) {
        return await this.paginateService.categoryServerPaginate(options);
    }

    /**
     * 검색 키워드와 일치한 서버 목록 페이지네이션
     * @param {searchServerPaginateOptions} options
     */
    async tagServerPaginate(options: TagServerPaginateOptions) {
        return await this.paginateService.tagServerPaginate(options);
    }

    /**
     * 검색 키워드와 일치한 서버 목록 페이지네이션
     * @param {searchServerPaginateOptions} options
     */
    async searchServerPaginate(options: SearchServerPaginateOptions) {
        return await this.paginateService.searchServerPaginate(options);
    }

    /**
     * 나의 서버 목록 페이지네이션
     * @param {myServerPaginateOptions} options
     */
    async myServerPaginate(options: MyServerPaginateOptions) {
        return await this.paginateService.myServerPaginate(options);
    }
}
