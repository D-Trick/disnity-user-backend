// types
import type { AdminGuild, SaveLoginInfo } from './types/users.type';
import type { Channel } from '@models/discord-api/types/discordApi.type';
// @nestjs
import { Injectable } from '@nestjs/common';
// services
import { UsersDataService } from './services/data.service';
import { UsersStoreService } from './services/store.service';
import { UsersUpdateService } from './services/update.service';

// ----------------------------------------------------------------------

@Injectable()
export class UsersService {
    /**************************************************
     * Constructor
     **************************************************/
    constructor(
        private readonly dataService: UsersDataService,
        private readonly storeService: UsersStoreService,
        private readonly updateService: UsersUpdateService,
    ) {}

    /**************************************************
     * Public Methods
     **************************************************/
    /******************************
     * dataService
     ******************************/
    /**
     * 디스니티 유저 가져오기
     * @param {string} userId
     */
    async getUser(userId: string) {
        return await this.dataService.getUser(userId);
    }

    /**
     * 디스코드 유저 가져오기
     * @param {string} userId
     */
    async getDiscordUser(userId: string) {
        return await this.dataService.getDiscordUser(userId);
    }

    /**
     * 관리자 권한이 있는 나의 길드 목록 조회
     * @param {string} userId
     */
    async getAdminGuilds(userId: string): Promise<AdminGuild[]> {
        return await this.dataService.getAdminGuilds(userId);
    }

    /**
     * 초대생성 권한이 있는 길드 채널 목록 조회
     * @param {string} guildId
     * @param {string} userId
     */
    async getChannels(guildId: string, userId: string, refresh: boolean): Promise<Channel[]> {
        await this.updateService.refreshAdminGuilds(userId);
        const channels = await this.dataService.getChannels(guildId, userId, refresh);

        return channels;
    }

    /******************************
     * storeService
     ******************************/
    /**
     * 로그인 유저 정보 저장
     * @param user
     */
    async saveLoginInfo(loginUser: SaveLoginInfo) {
        return await this.storeService.saveLoginInfo(loginUser);
    }

    /******************************
     * updateService
     ******************************/
    /**
     * 관리자 권한이 있는 길드 목록 새로고침
     * @param {string} userId
     */
    async refreshAdminGuilds(userId: string): Promise<AdminGuild[]> {
        return await this.updateService.refreshAdminGuilds(userId);
    }
}
