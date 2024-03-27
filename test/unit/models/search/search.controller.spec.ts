// test
import { Test } from '@nestjs/testing';
import { mock, instance, when } from 'ts-mockito';
// lib
import { plainToInstance } from 'class-transformer';
// dtos
import { ParamKeywordRequestDto } from '@common/dtos';
import { ServerFilterRequestDto } from '@models/servers/dtos';
import { SearchServerListResponseDto } from '@models/search/dtos';
// controllers
import { SearchController } from '@models/search/search.controller';
// services
import { ServersListService } from '@models/servers/services/list.service';

// ----------------------------------------------------------------------

describe('SearchController', () => {
    let searchController: SearchController;

    const serversListServiceMock: ServersListService = mock(ServersListService);

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            controllers: [SearchController],
            providers: [{ provide: ServersListService, useValue: instance(serversListServiceMock) }],
        }).compile();

        searchController = moduleRef.get<SearchController>(SearchController);
    });

    describe('serverList', () => {
        it(`검색 키워드와 일치한 서버 목록을 조회한다`, async () => {
            // Given
            const param = plainToInstance(ParamKeywordRequestDto, {
                keyword: '검색키워드',
            });
            const query = plainToInstance(ServerFilterRequestDto, {
                sort: 'create',
                min: 0,
                max: 5000,
                page: 0,
                itemSize: 30,
            });
            const dataMock = {
                keyword: param.keyword,
                totalCount: '0',
                list: [],
            };

            when(serversListServiceMock.getSearchServers(param.keyword, query)).thenResolve(dataMock);

            // When
            const searchServers = await searchController.serverList(param, query);

            // Than
            expect(searchServers).toStrictEqual(new SearchServerListResponseDto(dataMock));
        });
    });
});
