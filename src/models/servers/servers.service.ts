// types
import type { SaveValues } from './types/save.type';
import type { ServersFilterQuery } from '@models/pagination/servers/types/servers-pagination.type';
// @nestjs
import { Injectable } from '@nestjs/common';
// services
import { ServersDataService } from './services/data.service';
import { ServersStoreService } from './services/store.service';
import { ServersUpdateService } from './services/update.service';
import { ServersDeleteService } from './services/delete.service';
import { ServersDetailService } from './services/detail.service';

// ----------------------------------------------------------------------

@Injectable()
export class ServersService {
    /**************************************************
     * Constructor
     **************************************************/
    constructor(
        private readonly dataService: ServersDataService,
        private readonly storeService: ServersStoreService,
        private readonly updateService: ServersUpdateService,
        private readonly deleteService: ServersDeleteService,
        private readonly detailService: ServersDetailService,
    ) {}

    /**************************************************
     * Public Methods
     **************************************************/
    /******************************
     * dataService
     ******************************/
    /**
     * 서버 전체 목록 가져오기
     * @param {ServersFilterQuery} filterQuery
     */
    async getAllServers(filterQuery: ServersFilterQuery) {
        return await this.dataService.getAllServers(filterQuery);
    }

    /**
     * 카테고리에 해당하는 서버 목록 가져오기
     * @param {number} categoryId
     * @param {ServersFilterQuery} filterQuery
     */
    async getCategoryServers(categoryId: number, filterQuery: ServersFilterQuery) {
        return await this.dataService.getCategoryServers(categoryId, filterQuery);
    }

    /**
     * 태그명에 해당하는 서버 목록 가져오기
     * @param {string} tagName
     * @param {ServersFilterQuery} filterQuery
     */
    async getTagServers(tagName: string, filterQuery: ServersFilterQuery) {
        return await this.dataService.getTagServers(tagName, filterQuery);
    }

    /**
     * 검색 키워드와 일치한 서버 목록 가져오기
     * @param {string} keyword
     * @param {ServersFilterQuery} filterQuery
     */
    async getSearchServers(keyword: string, filterQuery: ServersFilterQuery) {
        return await this.dataService.getSearchServers(keyword, filterQuery);
    }

    /**
     * 나의 서버 목록 가져오기
     * @param {string} userId
     * @param {ServersFilterQuery} filterQuery
     */
    async getMyServers(userId: string, filterQuery: ServersFilterQuery) {
        return await this.dataService.getMyServers(userId, filterQuery);
    }

    /******************************
     * detailService
     *******************************/
    /**
     * 서버 상세조회
     * @param {string} id
     * @param {string} userId
     * @returns 서버상세 정보
     */
    async detail(id: string, userId: string) {
        return await this.detailService.server(id, userId);
    }

    /**
     * [Mypage] 나의 서버 상세 정보 조회
     * @param {string} id
     * @param {string } userId
     */
    async myServerDetail(id: string, userId: string) {
        return await this.detailService.myServer(id, userId);
    }

    /******************************
     * storeService
     *******************************/
    /**
     * 서버 등록
     * @param {string} userId
     * @param {SaveValues} saveValues
     */
    async store(userId: string, saveValues: SaveValues) {
        return await this.storeService.store(userId, saveValues);
    }

    /******************************
     * updateService
     *******************************/
    /**
     * 서버 수정
     * @param {string} userId
     * @param {SaveValues} saveValues
     */
    async edit(serverId: string, userId: string, saveValues: Partial<SaveValues>) {
        return await this.updateService.edit(serverId, userId, saveValues);
    }

    /**
     * 서버 새로고침
     * @param {string} guildId
     * @param {string} userId
     */
    async refresh(guildId: string, userId: string) {
        return await this.updateService.refresh(guildId, userId);
    }

    /******************************
     * deleteService
     *******************************/
    /**
     * 서버 삭제
     * @param {string} userId
     * @param {string} serverId
     */
    async delete(userId: string, serverId: string) {
        return await this.deleteService.delete(userId, serverId);
    }
}
