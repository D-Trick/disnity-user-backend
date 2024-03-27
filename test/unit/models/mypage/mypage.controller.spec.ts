// types
import { FindMyGuildDetailById } from '@databases/types/guild.type';
// test
import { Test } from '@nestjs/testing';
import { mock, instance, when } from 'ts-mockito';
// lib
import { plainToInstance } from 'class-transformer';
// dtos
import { AuthUserDto } from '@models/auth/dtos';
import { ParamIdStringRequestDto } from '@common/dtos';
import { ServerFilterRequestDto } from '@models/servers/dtos';
import { MyServerListResponseDto, MyServerResponseDto } from '@models/mypage/dtos';
// controllers
import { MypageController } from '@models/mypage/mypage.controller';
// services
import { ServersListService } from '@models/servers/services/list.service';
import { ServersDetailService } from '@models/servers/services/detail.service';
// entities
import { Tag } from '@databases/entities/tag.entity';

// ----------------------------------------------------------------------

describe('MypageController', () => {
    let mypageController: MypageController;

    const serversListServiceMock: ServersListService = mock(ServersListService);
    const serversDetailServiceMock: ServersDetailService = mock(ServersDetailService);

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            controllers: [MypageController],
            providers: [
                { provide: ServersListService, useValue: instance(serversListServiceMock) },
                { provide: ServersDetailService, useValue: instance(serversDetailServiceMock) },
            ],
        }).compile();

        mypageController = moduleRef.get<MypageController>(MypageController);
    });

    describe('servers', () => {
        it(`나의 서버 목록을 조회한다`, async () => {
            // Given
            const user = AuthUserDto.create({ id: '1', isLogin: true });
            const query = plainToInstance(ServerFilterRequestDto, {
                sort: 'create',
                min: 1,
                max: 5000,
                page: 1,
                itemSize: 30,
            });
            const dataMock = {
                totalCount: '0',
                list: [],
            };

            when(serversListServiceMock.getMyServers(user.id, query)).thenResolve(dataMock);

            // When
            const myServers = await mypageController.servers(user, query);

            // Than
            expect(myServers).toStrictEqual(new MyServerListResponseDto(dataMock));
        });
    });

    describe('serverDetail', () => {
        it(`나의 서버를 조회한다`, async () => {
            // Given
            const user = AuthUserDto.create({
                id: '1',
                isLogin: true,
            });
            const param = plainToInstance(ParamIdStringRequestDto, {
                id: '1',
            });
            const dataMock: FindMyGuildDetailById & { tags: Tag[] } = {
                id: '',
                category_id: 0,
                name: '',
                summary: '',
                content: '',
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
            };

            when(serversDetailServiceMock.myServer(param.id, user.id)).thenResolve(dataMock);

            // When
            const myServer = await mypageController.serverDetail(user, param);

            // Than
            expect(myServer).toStrictEqual(new MyServerResponseDto(dataMock));
        });
    });
});
