// types
import { AdminGuild } from '@models/users/types/users.type';
import { CacheDiscordUser, CacheUser } from '@cache/types';
// test
import { Test } from '@nestjs/testing';
import { mock, instance, when, anything } from 'ts-mockito';
// dtos
import { AuthUserDto } from '@models/auth/dtos';
// helpers
import { UtilHelper } from '@models/users/helper/util.helper';
import { FilterHelper } from '@models/users/helper/filter.helper';
// services
import { CacheDataService } from '@cache/cache-data.service';
import { UsersListService } from '@models/users/services/list.service';
// repositories
import { UserRepository } from '@databases/repositories/user';

// ----------------------------------------------------------------------

describe('UsersListService', () => {
    let usersListService: UsersListService;

    const user = AuthUserDto.create({ id: '1', isLogin: true });

    const utilHelperMock: UtilHelper = mock(UtilHelper);
    const filterHelperMock: FilterHelper = mock(FilterHelper);

    const cacheDataServiceMock: CacheDataService = mock(CacheDataService);

    const userRepositoryMock: UserRepository = mock(UserRepository);

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            providers: [
                UsersListService,
                { provide: UtilHelper, useValue: instance(utilHelperMock) },
                { provide: FilterHelper, useValue: instance(filterHelperMock) },
                { provide: UserRepository, useValue: instance(userRepositoryMock) },
                { provide: CacheDataService, useValue: instance(cacheDataServiceMock) },
            ],
        }).compile();

        usersListService = moduleRef.get<UsersListService>(UsersListService);
    });

    describe('getUser', () => {
        it('유저 정보를 Cache에서 조회한다', async () => {
            // Given
            const dataMock: CacheUser = {
                id: user.id,
                global_name: '닉네임',
                username: '@asdqwe',
                discriminator: '',
                email: 'test@naver.com',
                verified: 1,
                avatar: undefined,
                locale: 'ko',
                created_at: undefined,
                updated_at: new Date(),
            };

            when(cacheDataServiceMock.getUserById(user.id)).thenResolve(dataMock);

            // When
            const aUser = await usersListService.getUser(user.id);

            // Than
            expect(aUser).toStrictEqual(dataMock);
        });

        it('유저 정보를 DB에서 조회한다', async () => {
            // Given
            const dataMock: CacheUser = {
                id: '',
                global_name: '닉네임',
                username: '@asdqwe',
                discriminator: '',
                email: 'test@naver.com',
                verified: 1,
                avatar: undefined,
                locale: 'ko',
                created_at: undefined,
                updated_at: new Date(),
            };

            when(cacheDataServiceMock.getUserById(user.id)).thenResolve(undefined);
            when(userRepositoryMock.cFindOne(anything())).thenResolve(dataMock);

            // When
            const aUser = await usersListService.getUser(user.id);

            // Than
            expect(aUser).toStrictEqual(dataMock);
        });

        it('유저 정보가 없으면 에러가 발생한다', async () => {
            // Given
            const dataMock = undefined;

            when(cacheDataServiceMock.getUserById(user.id)).thenResolve(undefined);
            when(userRepositoryMock.cFindOne(anything())).thenResolve(dataMock);

            // When
            const wrap = async () => usersListService.getUser(user.id);

            // Than
            expect(wrap).rejects.toThrow('로그인을 해주세요.');
        });
    });

    describe('getDiscordUser', () => {
        it('디스코드 유저를 조회한다', async () => {
            // Given
            const dataMock: CacheDiscordUser = {
                id: '',
                global_name: '닉네임',
                username: '@asdqwe',
                discriminator: '',
                email: 'test@naver.com',
                verified: 1,
                avatar: undefined,
                locale: 'ko',
                created_at: undefined,
                updated_at: new Date(),

                guilds: [],
                admin_guilds: [],

                access_token: 'aa.aa.aa',
                refresh_token: 'bb.bb.bb',
            };

            when(cacheDataServiceMock.getDiscordUserById(user.id)).thenResolve(dataMock);

            // When
            const discordUser = await usersListService.getDiscordUser(user.id);

            // Than
            expect(discordUser).toStrictEqual(dataMock);
        });

        it('디스코드 유저 정보가 없으면 에러가 발생한다', async () => {
            // Given
            const dataMock = undefined;

            when(cacheDataServiceMock.getDiscordUserById(user.id)).thenResolve(dataMock);

            // When
            const wrap = async () => usersListService.getDiscordUser(user.id);

            // Than
            expect(wrap).rejects.toThrow('디스코드를 로그인 해주세요.');
        });
    });

    describe('getAdminGuilds', () => {
        it('유저가 속한 관리자 권한을 가진 길드를 조회한다', async () => {
            // Given
            const dataMock1: CacheDiscordUser = {
                id: '',
                global_name: '닉네임',
                username: '@asdqwe',
                discriminator: '',
                email: 'test@naver.com',
                verified: 1,
                avatar: undefined,
                locale: 'ko',
                created_at: undefined,
                updated_at: new Date(),

                guilds: [],
                admin_guilds: [
                    {
                        id: '1',
                        name: '서버 이름',
                        icon: '',
                        owner: true,
                        permissions: 0,
                        permissions_new: '',
                        features: [],
                    },
                ],

                access_token: 'aa.aa.aa',
                refresh_token: 'bb.bb.bb',
            };
            const dataMock2 = [
                {
                    ...dataMock1.guilds[0],
                    channels: [],
                },
            ];

            when(cacheDataServiceMock.getDiscordUserById(user.id)).thenResolve(dataMock1);
            when(filterHelperMock.removeRegisteredGuild(dataMock1.admin_guilds)).thenResolve(dataMock2);

            // When
            const adminGuilds = await usersListService.getAdminGuilds(user.id);

            // Than
            expect(adminGuilds).toStrictEqual(dataMock2);
        });
    });

    describe('getChannels', () => {
        it('유저가 속한 관리자 권한을 가진 길드에 채널을 조회한다', async () => {
            // Given
            const guildId = '1';
            const dataMock1: CacheDiscordUser = {
                id: '',
                global_name: '닉네임',
                username: '@asdqwe',
                discriminator: '',
                email: 'test@naver.com',
                verified: 1,
                avatar: undefined,
                locale: 'ko',
                created_at: undefined,
                updated_at: new Date(),

                guilds: [],
                admin_guilds: [
                    {
                        id: '1',
                        name: '서버 이름',
                        icon: '',
                        owner: true,
                        permissions: 0,
                        permissions_new: '',
                        features: [],
                    },
                ],

                access_token: 'aa.aa.aa',
                refresh_token: 'bb.bb.bb',
            };
            const dataMock2: AdminGuild = {
                ...dataMock1.guilds[0],
                channels: [],
            };

            when(cacheDataServiceMock.getDiscordUserById(user.id)).thenResolve(dataMock1);
            when(utilHelperMock.getAdminGuild(guildId, dataMock1.admin_guilds)).thenReturn(dataMock2);

            // When
            const channels = await usersListService.getChannels(guildId, user.id, false);

            // Than
            expect(channels).toStrictEqual(dataMock2.channels);
        });
    });
});
