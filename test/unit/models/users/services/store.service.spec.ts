// test
import { Test } from '@nestjs/testing';
import { mock, instance, when, anything } from 'ts-mockito';
// lib
import { DataSource } from 'typeorm';
// dtos
import { AuthDiscordUserDto } from '@models/auth/dtos';
// services
import { CacheService } from '@cache/cache.service';
import { CacheDataService } from '@cache/cache-data.service';
import { UsersStoreService } from '@models/users/services/store.service';
// repositories
import { UserRepository } from '@databases/repositories/user';
import { AccessLogRepository } from '@databases/repositories/access-log';

// ----------------------------------------------------------------------

describe('UsersStoreService', () => {
    let usersStoreService: UsersStoreService;

    const dataSourceMock: DataSource = mock(DataSource);

    const cacheServiceMock: CacheService = mock(CacheService);
    const cacheDataServiceMock: CacheDataService = mock(CacheDataService);

    const userRepositoryMock: UserRepository = mock(UserRepository);
    const accessLogRepositoryMock: AccessLogRepository = mock(AccessLogRepository);

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            providers: [
                UsersStoreService,
                { provide: DataSource, useValue: instance(dataSourceMock) },

                { provide: CacheService, useValue: instance(cacheServiceMock) },
                { provide: CacheDataService, useValue: instance(cacheDataServiceMock) },

                { provide: UserRepository, useValue: instance(userRepositoryMock) },
                { provide: AccessLogRepository, useValue: instance(accessLogRepositoryMock) },
            ],
        }).compile();

        usersStoreService = moduleRef.get<UsersStoreService>(UsersStoreService);
    });

    describe('loginUser', () => {
        it('로그인한 유저 정보를 저장한다', async () => {
            // Given
            const user = AuthDiscordUserDto.create({
                id: '1',
                global_name: '닉네임',
                username: '@asdqwe',
                discriminator: '',
                email: 'test@naver.com',
                avatar: undefined,
                locale: 'ko',

                access_token: 'aa.aa.aa',
                refresh_token: 'bb.bb.bb',
            });
            const ip = '1.1.1.1';
            const dataMock: any = {
                startTransaction: jest.fn(),
                commitTransaction: jest.fn(),
                isTransactionActive: false,
                release: jest.fn(),
            };

            when(dataSourceMock.createQueryRunner()).thenReturn(dataMock);
            when(cacheServiceMock.set(anything(), anything(), anything())).thenResolve(anything());
            when(userRepositoryMock.cFindOne(anything())).thenResolve(anything());
            when(userRepositoryMock.cInsert(anything())).thenResolve(anything());
            when(userRepositoryMock.cUpdate(anything())).thenResolve(anything());
            when(accessLogRepositoryMock.cInsert(anything())).thenResolve(anything());

            // When
            const result = await usersStoreService.loginUser(user, ip);

            // Than
            expect(result).not.toBeFalsy();
        });
    });
});
