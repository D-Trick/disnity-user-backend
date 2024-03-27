// types
import { CacheUser } from '@cache/types';
import { AdminGuild } from '@models/users/types/users.type';
import { Channel } from '@models/discord-api/types/discord-api.type';
// test
import { Test } from '@nestjs/testing';
import { mock, instance, when } from 'ts-mockito';
// lib
import { plainToInstance } from 'class-transformer';
// dtos
import { AuthUserDto } from '@models/auth/dtos';
import { ParamGuildIdRequestDto } from '@common/dtos';
import {
    AdminGuildListResponseDto,
    AdminGuildResponseDto,
    ChannelListResponseDto,
    UserResponseDto,
} from '@models/users/dtos';
// helpers
import { UtilHelper } from '@models/users/helper/util.helper';
// controllers
import { UsersController } from '@models/users/users.controller';
// services
import { UsersListService } from '@models/users/services/list.service';
import { UsersUpdateService } from '@models/users/services/update.service';

// ----------------------------------------------------------------------

describe('UsersController', () => {
    let usersController: UsersController;

    const user = AuthUserDto.create({ id: '1', isLogin: true });

    const usersListServicesMock: UsersListService = mock(UsersListService);
    const usersUpdateServiceMock: UsersUpdateService = mock(UsersUpdateService);

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            controllers: [UsersController],
            providers: [
                UtilHelper,
                { provide: UsersListService, useValue: instance(usersListServicesMock) },
                { provide: UsersUpdateService, useValue: instance(usersUpdateServiceMock) },
            ],
        }).compile();

        usersController = moduleRef.get<UsersController>(UsersController);
    });

    describe('me', () => {
        it('유저 정보를 조회한다', async () => {
            // Given
            const dataMock: CacheUser = {
                id: user.id,
                global_name: '전체이름',
                username: '@asdqwe',
                discriminator: '',
                email: 'test@naver.com',
                verified: 1,
                avatar: undefined,
                locale: 'ko',
                created_at: undefined,
                updated_at: new Date(),
            };

            when(usersListServicesMock.getUser(user.id)).thenResolve(dataMock);

            // When
            const aUser = await usersController.me(user);

            // Than
            expect(aUser).toStrictEqual(new UserResponseDto(dataMock));
        });
    });

    describe('guildList', () => {
        it('유저가 속한 길드 목록을 조회한다', async () => {
            // Given
            const dataMock: AdminGuild[] = [
                {
                    id: '1',
                    name: '서버이름',
                    icon: '',
                    owner: false,
                    permissions: 0,
                    permissions_new: '',
                    features: [],
                },
            ];

            when(usersListServicesMock.getAdminGuilds(user.id)).thenResolve(dataMock);

            // When
            const adminGuilds = await usersController.guildList(user);

            // Than
            expect(adminGuilds[0]).toStrictEqual(new AdminGuildListResponseDto(dataMock[0]));
        });
    });

    describe('guildListRefresh', () => {
        it('유저가 속한 길드 목록을 새로고침한다', async () => {
            // Given
            const dataMock: AdminGuild[] = [
                {
                    id: '1',
                    name: '서버이름',
                    icon: '',
                    owner: false,
                    permissions: 0,
                    permissions_new: '',
                    features: [],
                },
            ];

            when(usersUpdateServiceMock.refreshAdminGuilds(user.id)).thenResolve(dataMock);

            // When
            const adminGuilds = await usersController.guildListRefresh(user);

            // Than
            expect(adminGuilds[0]).toStrictEqual(new AdminGuildListResponseDto(dataMock[0]));
        });
    });

    describe('guildDetail', () => {
        it('유저가 속한 길드를 조회한다', async () => {
            // Given
            const param = plainToInstance(ParamGuildIdRequestDto, {
                guildId: '1',
            });
            const dataMock: AdminGuild[] = [
                {
                    id: param.guildId,
                    name: '서버이름',
                    icon: '',
                    owner: false,
                    permissions: 0,
                    permissions_new: '',
                    features: [],
                },
            ];

            when(usersListServicesMock.getAdminGuilds(user.id)).thenResolve(dataMock);

            // When
            const guild = await usersController.guildDetail(param, user);

            // Than
            expect(guild).toStrictEqual(new AdminGuildResponseDto(dataMock[0]));
        });
    });

    describe('channelList', () => {
        it('유저가 속한 길드의 채널을 조회한다', async () => {
            // Given
            const param = plainToInstance(ParamGuildIdRequestDto, {
                guildId: '1',
            });
            const dataMock: Channel[] = [
                {
                    id: '1',
                    type: 0,
                    guild_id: param.guildId,
                    position: 0,
                    permission_overwrites: [],
                    name: '채널이름',
                    topic: '',
                    nsfw: false,
                    last_message_id: '',
                    bitrate: 0,
                    user_limit: 0,
                    rate_limit_per_user: 0,
                    recipients: [],
                    icon: '',
                    owner_id: '',
                    application_id: '',
                    parent_id: '',
                    last_pin_timestamp: '',
                    rtc_region: '',
                    video_quality_mode: 0,
                    message_count: 0,
                    member_count: 0,
                    thread_metadata: [],
                    member: [],
                    default_auto_archive_duration: 0,
                    permissions: 0,
                    flags: 0,
                    total_message_sent: 0,
                    available_tags: [],
                    applied_tags: [],
                    default_reaction_emoji: [],
                    default_thread_rate_limit_per_user: 0,
                    default_sort_order: 0,
                    default_forum_layout: 0,
                },
            ];

            when(usersListServicesMock.getChannels(param.guildId, user.id, false)).thenResolve(dataMock);

            // When
            const channels = await usersController.channelList(param, user);

            // Than
            expect(channels[0]).toStrictEqual(new ChannelListResponseDto(dataMock[0]));
        });
    });

    describe('channelListRefresh', () => {
        it('유저가 속한 길드의 채널을 새로고침한다', async () => {
            // Given
            const param = plainToInstance(ParamGuildIdRequestDto, {
                guildId: '1',
            });
            const dataMock: Channel[] = [
                {
                    id: '1',
                    type: 0,
                    guild_id: param.guildId,
                    position: 0,
                    permission_overwrites: [],
                    name: '채널이름',
                    topic: '',
                    nsfw: false,
                    last_message_id: '',
                    bitrate: 0,
                    user_limit: 0,
                    rate_limit_per_user: 0,
                    recipients: [],
                    icon: '',
                    owner_id: '',
                    application_id: '',
                    parent_id: '',
                    last_pin_timestamp: '',
                    rtc_region: '',
                    video_quality_mode: 0,
                    message_count: 0,
                    member_count: 0,
                    thread_metadata: [],
                    member: [],
                    default_auto_archive_duration: 0,
                    permissions: 0,
                    flags: 0,
                    total_message_sent: 0,
                    available_tags: [],
                    applied_tags: [],
                    default_reaction_emoji: [],
                    default_thread_rate_limit_per_user: 0,
                    default_sort_order: 0,
                    default_forum_layout: 0,
                },
            ];

            when(usersListServicesMock.getChannels(param.guildId, user.id, true)).thenResolve(dataMock);

            // When
            const channels = await usersController.channelListRefresh(param, user);

            // Than
            expect(channels[0]).toStrictEqual(new ChannelListResponseDto(dataMock[0]));
        });
    });
});
