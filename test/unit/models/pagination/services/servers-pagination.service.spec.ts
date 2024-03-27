// types
import type { Count } from '@databases/types/global';
import type { FindGuildsByIds } from '@databases/types/guild.type';
// test
import { Test } from '@nestjs/testing';
import { mock, instance, when, anything } from 'ts-mockito';
// lib
import { plainToInstance } from 'class-transformer';
// dtos
import { ServerFilterRequestDto } from '@models/servers/dtos';
// services
import { ServersPaginationService } from '@models/pagination/services/servers-pagination.service';
// repositories
import { TagRepository } from '@databases/repositories/tag';
import { GuildRepository } from '@databases/repositories/guild';

// ----------------------------------------------------------------------

describe('PaginationService', () => {
    let serversPaginationService: ServersPaginationService;

    const tagRepositoryMock: TagRepository = mock(TagRepository);
    const guildRepositoryMock: GuildRepository = mock(GuildRepository);

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            providers: [
                ServersPaginationService,
                { provide: TagRepository, useValue: instance(tagRepositoryMock) },
                { provide: GuildRepository, useValue: instance(guildRepositoryMock) },
            ],
        }).compile();

        serversPaginationService = moduleRef.get<ServersPaginationService>(ServersPaginationService);
    });

    describe('categoryServerPaginate', () => {
        it('카테고리와 일치한 서버 목록을 페이지 매김하고 조회한다', async () => {
            // Given
            const categoryId = 1;
            const request = plainToInstance(ServerFilterRequestDto, {
                sort: 'create',
                min: 0,
                max: 5000,
                page: 0,
                itemSize: 30,
            });

            const dataMock1: string[] = ['1'];
            const dataMock2: Count = { count: '1' };
            const dataMock3: FindGuildsByIds['base'][] = [
                {
                    id: '1',
                    name: '',
                    summary: '',
                    icon: '',
                    online: 1,
                    member: 1,
                    banner: '',
                    link_type: '',
                    refresh_date: '',
                    category_name: '',
                    tags: [
                        {
                            id: '',
                            name: '',
                        },
                    ],
                },
            ];
            const dataMock4 = {
                totalCount: dataMock2.count,
                list: dataMock3,
            };

            when(guildRepositoryMock.findCategoryGuildIds(anything())).thenResolve(dataMock1);
            when(guildRepositoryMock.totalCategoryGuildsCount(anything())).thenResolve(dataMock2);
            when(guildRepositoryMock.findGuildsByIds(anything())).thenResolve(dataMock3);

            // When
            const categoryServer = await serversPaginationService.categoryServerPaginate(categoryId, request);

            // Than
            expect(categoryServer).toStrictEqual(dataMock4);
        });
    });

    describe('tagServerPaginate', () => {
        it('태그와 일치한 서버 목록을 페이지 매김하고 조회한다', async () => {
            // Given
            const tagName = '태그이름';
            const request = plainToInstance(ServerFilterRequestDto, {
                sort: 'create',
                min: 0,
                max: 5000,
                page: 0,
                itemSize: 30,
            });

            const dataMock1: string[] = ['1'];
            const dataMock2: Count = { count: '1' };
            const dataMock3: FindGuildsByIds['base'][] = [
                {
                    id: '1',
                    name: '',
                    summary: '',
                    icon: '',
                    online: 1,
                    member: 1,
                    banner: '',
                    link_type: '',
                    refresh_date: '',
                    category_name: '',
                    tags: [
                        {
                            id: '',
                            name: '',
                        },
                    ],
                },
            ];
            const dataMock4 = {
                totalCount: dataMock2.count,
                list: dataMock3,
            };

            when(tagRepositoryMock.findTagGuildIds(anything())).thenResolve(dataMock1);
            when(tagRepositoryMock.totalTagGuildsCount(anything())).thenResolve(dataMock2);
            when(guildRepositoryMock.findGuildsByIds(anything())).thenResolve(dataMock3);

            // When
            const tagServer = await serversPaginationService.tagServerPaginate(tagName, request);

            // Than
            expect(tagServer).toStrictEqual(dataMock4);
        });
    });

    describe('searchServerPaginate', () => {
        it('검색 키워드와 일치한 서버 목록을 페이지 매김하고 조회한다', async () => {
            // Given
            const keyword = '키워드';
            const request = plainToInstance(ServerFilterRequestDto, {
                sort: 'create',
                min: 0,
                max: 5000,
                page: 0,
                itemSize: 30,
            });

            const dataMock1: string[] = ['1'];
            const dataMock2: Count = { count: '1' };
            const dataMock3: FindGuildsByIds['base'][] = [
                {
                    id: '1',
                    name: '',
                    summary: '',
                    icon: '',
                    online: 1,
                    member: 1,
                    banner: '',
                    link_type: '',
                    refresh_date: '',
                    category_name: '',
                    tags: [
                        {
                            id: '',
                            name: '',
                        },
                    ],
                },
            ];
            const dataMock4 = {
                totalCount: dataMock2.count,
                list: dataMock3,
            };

            when(guildRepositoryMock.findSearchGuildIds(anything())).thenResolve(dataMock1);
            when(guildRepositoryMock.totalSearchGuildsCount(anything())).thenResolve(dataMock2);
            when(guildRepositoryMock.findGuildsByIds(anything())).thenResolve(dataMock3);

            // When
            const searchServer = await serversPaginationService.searchServerPaginate(keyword, request);

            // Than
            expect(searchServer).toStrictEqual(dataMock4);
        });
    });

    describe('myServerPaginate', () => {
        it('나의 서버 목륵을 페이지 매김하고 조회한다', async () => {
            // Given
            const userId = '1';
            const request = plainToInstance(ServerFilterRequestDto, {
                sort: 'create',
                min: 0,
                max: 5000,
                page: 0,
                itemSize: 30,
            });

            const dataMock1: string[] = ['1'];
            const dataMock2: Count = { count: '1' };
            const dataMock3: FindGuildsByIds['base'][] = [
                {
                    id: '1',
                    name: '',
                    summary: '',
                    icon: '',
                    online: 1,
                    member: 1,
                    banner: '',
                    link_type: '',
                    refresh_date: '',
                    category_name: '',
                    tags: [
                        {
                            id: '',
                            name: '',
                        },
                    ],
                },
            ];
            const dataMock4 = {
                totalCount: dataMock2.count,
                list: dataMock3,
            };

            when(guildRepositoryMock.findMyGuildIds(anything())).thenResolve(dataMock1);
            when(guildRepositoryMock.totalMyGuildsCount(anything())).thenResolve(dataMock2);
            when(guildRepositoryMock.findGuildsByIds(anything())).thenResolve(dataMock3);

            // When
            const myServer = await serversPaginationService.myServerPaginate(userId, request);

            // Than
            expect(myServer).toStrictEqual(dataMock4);
        });
    });
});
