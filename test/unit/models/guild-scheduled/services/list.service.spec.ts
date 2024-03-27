// types
import type { FindThisMonthSchedules } from '@databases/types/guild-scheduled.type';
// test
import { Test } from '@nestjs/testing';
import { mock, instance, when } from 'ts-mockito';
// services
import { GuildScheduledListService } from '@models/guild-scheduled/services/list.service';
// repositories
import { GuildScheduledRepository } from '@databases/repositories/guild-scheduled';

// ----------------------------------------------------------------------

describe('GuildScheduledListService', () => {
    let guildScheduledListService: GuildScheduledListService;

    const guildScheduledRepositoryMock: GuildScheduledRepository = mock(GuildScheduledRepository);

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            providers: [
                GuildScheduledListService,
                { provide: GuildScheduledRepository, useValue: instance(guildScheduledRepositoryMock) },
            ],
        }).compile();

        guildScheduledListService = moduleRef.get<GuildScheduledListService>(GuildScheduledListService);
    });

    describe('getThisMonthSchedules', () => {
        it(`이번달 이벤트가 있는 서버 목록을 조회합니다.`, async () => {
            // Given
            const dataMock: FindThisMonthSchedules[] = [
                {
                    id: '',
                    name: '',
                    image: '',
                    description: '',
                    scheduled_start_time: '',
                    scheduled_end_time: '',
                    guild_id: '',
                    guild_name: '',
                    guild_icon: '',
                },
            ];
            when(guildScheduledRepositoryMock.findThisMonthSchedules()).thenResolve(dataMock);

            // When
            const thisMonthSchedules = await guildScheduledListService.getThisMonthSchedules();

            // Than
            expect(thisMonthSchedules[0]).toStrictEqual(dataMock[0]);
        });
    });
});
