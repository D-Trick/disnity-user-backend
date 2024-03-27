// test
import { Test } from '@nestjs/testing';
import { mock, instance, when } from 'ts-mockito';
// helpers
import { FilterHelper } from '@models/users/helper/filter.helper';
// services
import { CacheDataService } from '@cache/cache-data.service';
import { UsersListService } from '@models/users/services/list.service';
import { UsersUpdateService } from '@models/users/services/update.service';
import { DiscordApiUsersService } from '@models/discord-api/services/users.service';

// ----------------------------------------------------------------------

describe('UsersUpdateService', () => {
    let usersUpdateServiceMock: UsersUpdateService;

    const filterHelperMock: FilterHelper = mock(FilterHelper);

    const cacheDataServiceMock: CacheDataService = mock(CacheDataService);
    const usersDataServiceMock: UsersListService = mock(UsersListService);
    const discordApiUsersServiceMock: DiscordApiUsersService = mock(DiscordApiUsersService);

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            providers: [
                UsersUpdateService,
                { provide: FilterHelper, useValue: instance(filterHelperMock) },

                { provide: UsersListService, useValue: instance(usersDataServiceMock) },
                { provide: CacheDataService, useValue: instance(cacheDataServiceMock) },
                { provide: DiscordApiUsersService, useValue: instance(discordApiUsersServiceMock) },
            ],
        }).compile();

        usersUpdateServiceMock = moduleRef.get<UsersUpdateService>(UsersUpdateService);
    });

    describe('refreshAdminGuilds', () => {
        it('유저의 관리자 권한이 있는 길드를 새로고침한다', async () => {
            // Given
            const discordUser = {
                id: '1',
                global_name: '닉네임',
                username: '@asdqwe',
                discriminator: '',
                email: 'test@naver.com',
                avatar: undefined,
                locale: 'ko',
                guilds: [],
                admin_guilds: [],

                access_token: 'aa.aa.aa',
                refresh_token: 'bb.bb.bb',
            };
            const dataMock: any = { guilds: () => [] };

            when(usersDataServiceMock.getDiscordUser(discordUser.id)).thenResolve(discordUser);
            when(discordApiUsersServiceMock.guilds(discordUser.access_token)).thenReturn(dataMock);
            when(
                cacheDataServiceMock.setDiscordUser({
                    ...discordUser,
                    admin_guilds: discordUser.admin_guilds,
                }),
            ).thenResolve();
            when(filterHelperMock.removeRegisteredGuild([])).thenResolve([]);

            // When
            const adminGuilds = await usersUpdateServiceMock.refreshAdminGuilds(discordUser.id);

            // Than
            expect(adminGuilds).toBe(null);
        });
    });
});
