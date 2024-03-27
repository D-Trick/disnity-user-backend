// types
import type { FindThisMonthSchedules } from '@databases/types/guild-scheduled.type';
// test
import { Test } from '@nestjs/testing';
import { mock, instance, when } from 'ts-mockito';
// dtos
import { ThisMonthScheduleListResponseDto } from '@models/guild-scheduled/dtos';
// controllers
import { GuildScheduledController } from '@models/guild-scheduled/guild-scheduled.controller';
// services
import { GuildScheduledListService } from '@models/guild-scheduled/services/list.service';

// ----------------------------------------------------------------------

describe('GuildScheduledController', () => {
    let guildScheduledController: GuildScheduledController;

    const guildScheduledListServiceMock: GuildScheduledListService = mock(GuildScheduledListService);

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            controllers: [GuildScheduledController],
            providers: [{ provide: GuildScheduledListService, useValue: instance(guildScheduledListServiceMock) }],
        }).compile();

        guildScheduledController = moduleRef.get<GuildScheduledController>(GuildScheduledController);
    });

    describe('thisMonthSchedules', () => {
        it(`이번달 이벤트가 있는 서버 목록을 조회합니다`, async () => {
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
            when(guildScheduledListServiceMock.getThisMonthSchedules()).thenResolve(dataMock);

            // When
            const thisMonthSchedules = await guildScheduledController.thisMonthSchedules();

            // Than
            expect(thisMonthSchedules[0]).toStrictEqual(new ThisMonthScheduleListResponseDto(dataMock[0]));
        });
    });
});
