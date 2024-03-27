// types
import type { ServerDetail } from '@models/servers/types/servers.type';
// test
import { Test } from '@nestjs/testing';
import { mock, instance, when } from 'ts-mockito';
// lib
import { plainToInstance } from 'class-transformer';
// dtos
import { AuthUserDto } from '@models/auth/dtos';
import { ParamGuildIdRequestDto, ParamIdNumberRequestDto, ParamIdStringRequestDto } from '@common/dtos';
import {
    CategoryServerListResponseDto,
    CreateRequestDto,
    ResultResponseDto,
    SaveResultResponseDto,
    ServerFilterRequestDto,
    ServerResponseDto,
} from '@models/servers/dtos';
// controllers
import { ServersController } from '@models/servers/servers.controller';
// services
import { ServersListService } from '@models/servers/services/list.service';
import { ServersDetailService } from '@models/servers/services/detail.service';
import { ServersStoreService } from '@models/servers/services/store.service';
import { ServersUpdateService } from '@models/servers/services/update.service';
import { ServersDeleteService } from '@models/servers/services/delete.service';

// ----------------------------------------------------------------------

describe('ServersController 테스트를 시작합니다', () => {
    let serversController: ServersController;

    const serversListServiceMock: ServersListService = mock(ServersListService);
    const serversStoreServiceMock: ServersStoreService = mock(ServersStoreService);
    const serversDetailServiceMock: ServersDetailService = mock(ServersDetailService);
    const serversUpdateServiceMock: ServersUpdateService = mock(ServersUpdateService);
    const serversDeleteServiceMock: ServersDeleteService = mock(ServersDeleteService);

    const user = AuthUserDto.create({ id: '1', isLogin: true });

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            controllers: [ServersController],
            providers: [
                { provide: ServersListService, useValue: instance(serversListServiceMock) },
                { provide: ServersStoreService, useValue: instance(serversStoreServiceMock) },
                { provide: ServersDetailService, useValue: instance(serversDetailServiceMock) },
                { provide: ServersUpdateService, useValue: instance(serversUpdateServiceMock) },
                { provide: ServersDeleteService, useValue: instance(serversDeleteServiceMock) },
            ],
        }).compile();

        serversController = moduleRef.get<ServersController>(ServersController);
    });

    describe('allServerList', () => {
        it(`전체 서버를 조회한다`, async () => {
            // Given
            const query = plainToInstance(ServerFilterRequestDto, {
                sort: 'create',
                min: 0,
                max: 5000,
                page: 0,
                itemSize: 30,
            });
            const dataMock = {
                categoryName: '전체',
                totalCount: '0',
                list: [],
            };

            when(serversListServiceMock.getAllServers(query)).thenResolve(dataMock);

            // When
            const allServers = await serversController.allServerList(query);

            // Than
            expect(allServers).toStrictEqual(new CategoryServerListResponseDto(dataMock));
        });
    });

    describe('categoryServerList', () => {
        it(`카테고리에 속한 서버를 조회한다`, async () => {
            // Given
            const param = plainToInstance(ParamIdNumberRequestDto, {
                id: 1,
            });
            const query = plainToInstance(ServerFilterRequestDto, {
                sort: 'create',
                min: 0,
                max: 5000,
                page: 0,
                itemSize: 30,
            });
            const dataMock = {
                categoryName: '게임',
                totalCount: '0',
                list: [],
            };

            when(serversListServiceMock.getCategoryServers(param.id, query)).thenResolve(dataMock);

            // When
            const categoryServers = await serversController.categoryServerList(param, query);

            // Than
            expect(categoryServers).toStrictEqual(new CategoryServerListResponseDto(dataMock));
        });
    });

    describe('detail', () => {
        it('서버 상세를 조회한다', async () => {
            // Given
            const param = plainToInstance(ParamIdStringRequestDto, {
                id: '1',
            });
            const dataMock: ServerDetail = {
                id: param.id,
                category_id: 1,
                name: '서버 이름',
                summary: '서버 요약 내용',
                content: '서버 내용',
                is_markdown: false,
                icon: '',
                splash: '',
                online: 0,
                member: 0,
                premium_tier: 0,
                link_type: '',
                invite_code: '',
                membership_url: '',
                is_open: false,
                created_at: '',
                refresh_date: '',
                category_name: '',
                tags: [],
                admins: [],
                emojis: [],
                animate_emojis: [],
            };

            when(serversDetailServiceMock.server(param.id, user.id)).thenResolve(dataMock);

            // When
            const server = await serversController.detail(user, param);

            // Than
            expect(server).toStrictEqual(new ServerResponseDto(dataMock));
        });
    });

    describe('refresh', () => {
        it('서버를 새로고침 한다', async () => {
            // Given
            const param = plainToInstance(ParamGuildIdRequestDto, {
                guildId: '1',
            });
            const dataMock = true;

            when(serversUpdateServiceMock.refresh(param.guildId, user.id)).thenResolve(dataMock);

            // When
            const result = await serversController.refresh(user, param);

            // Than
            expect(result).toStrictEqual(new ResultResponseDto(dataMock));
        });
    });

    describe('store', () => {
        it('서버를 저장한다', async () => {
            // Given
            const body = plainToInstance(CreateRequestDto, {
                id: '1',
                serverOpen: 'public',
                categoryId: '1',
                linkType: 'invite',
                inviteAuto: 'manual',
                inviteCode: 'ASDASD2',
                channelId: '',
                membershipUrl: '',
                tags: [],
                summary: '서버 요약 내용',
                contentType: 'basic',
                content: '서버 내용',
            });
            const dataMock = body.id;

            when(serversStoreServiceMock.store(user.id, body)).thenResolve(dataMock);

            // When
            const id = await serversController.store(user, body);

            // Than
            expect(id).toStrictEqual(new SaveResultResponseDto(dataMock));
        });
    });

    describe('update', () => {
        it('서버를 수정한다', async () => {
            // Given
            const param = plainToInstance(ParamIdStringRequestDto, {
                id: '1',
            });
            const body = plainToInstance(CreateRequestDto, {
                serverOpen: 'public',
                categoryId: '1',
                linkType: 'invite',
                inviteAuto: 'manual',
                inviteCode: 'ASDASD2',
                channelId: '',
                membershipUrl: '',
                tags: [],
                summary: '서버 요약 내용',
                contentType: 'basic',
                content: '서버 내용',
            });
            const dataMock = body.id;

            when(serversUpdateServiceMock.edit(param.id, user.id, body)).thenResolve(dataMock);

            // When
            const id = await serversController.update(user, param, body);

            // Than
            expect(id).toStrictEqual(new SaveResultResponseDto(dataMock));
        });
    });

    describe('delete', () => {
        it('서버를 삭제한다', async () => {
            // Given
            const param = plainToInstance(ParamIdStringRequestDto, {
                id: '1',
            });
            const dataMock = true;

            when(serversDeleteServiceMock.delete(param.id, user.id)).thenResolve(dataMock);

            // When
            const result = await serversController.delete(user, param);

            // Than
            expect(result).toStrictEqual(new ResultResponseDto(dataMock));
        });
    });
});
