// test
import { Test } from '@nestjs/testing';
import { mock, instance, when, anything } from 'ts-mockito';
// lib
import { plainToInstance } from 'class-transformer';
// configs
import { DISCORD_CONFIG } from '@config/discord.config';
// dtos
import { AuthUserDto } from '@models/auth/dtos';
import { DiscordCallbackRequestDto } from '@models/redirect/dtos';
import { ParamIdStringRequestDto, ParamTypeAndGuildIdRequestDto } from '@common/dtos';
// controllers
import { RedirectController } from '@models/redirect/redirect.controller';
// repositories
import { GuildRepository } from '@databases/repositories/guild';

// ----------------------------------------------------------------------

describe('RedirectController', () => {
    let redirectController: RedirectController;

    const guildRepositoryMock: GuildRepository = mock(GuildRepository);

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            controllers: [RedirectController],
            providers: [{ provide: GuildRepository, useValue: instance(guildRepositoryMock) }],
        }).compile();

        redirectController = moduleRef.get<RedirectController>(RedirectController);
    });

    describe('botAdd', () => {
        it(`디스코드 봇 초대 주소로 이동한다`, async () => {
            // Given
            const res: any = {
                redirect: jest.fn(),
            };
            const param = plainToInstance(ParamTypeAndGuildIdRequestDto, {
                type: 'create',
                guildId: '1',
            });

            // When
            await redirectController.botAdd(res, param);

            // Than
            expect(res.redirect).toHaveBeenCalled();
        });
    });

    describe('botAddCallback', () => {
        it(`봇 추가 후 서버 추가 주소로 이동한다`, async () => {
            // Given
            const user = AuthUserDto.create({ id: '1', isLogin: true });
            const res: any = {
                redirect: (path: string) => path,
            };
            const query = plainToInstance(DiscordCallbackRequestDto, {
                redirect: 'create',
                guild_id: '11',
                code: '',
                permissions: '',
                error: '',
                error_description: '',
            });

            when(guildRepositoryMock.cUpdate(anything())).thenResolve();

            // When
            const redriectPath = await redirectController.botAddCallback(user, res, query);

            // Than
            expect(redriectPath).toBe('/servers/11/create?botAdded=true');
        });

        it(`봇 추가 후 접근 거부이면 봇 추가 주소로 이동한다`, async () => {
            // Given
            const user = AuthUserDto.create({ id: '1', isLogin: true });
            const res: any = {
                redirect: (path: string) => path,
            };
            const query = plainToInstance(DiscordCallbackRequestDto, {
                redirect: 'create',
                guild_id: '11',
                code: '',
                permissions: '',
                error: 'access_denied',
                error_description: '',
            });

            when(guildRepositoryMock.cUpdate(anything())).thenResolve();

            // When
            const redriectPath = await redirectController.botAddCallback(user, res, query);

            // Than
            expect(redriectPath).toBe('/mypage/servers/create');
        });

        it(`봇 추가 후 나의 서버 주소로 이동한다`, async () => {
            // Given
            const user = AuthUserDto.create({ id: '1', isLogin: true });
            const res: any = {
                redirect: (path: string) => path,
            };
            const query = plainToInstance(DiscordCallbackRequestDto, {
                redirect: 'mypage',
                guild_id: '',
                code: '',
                permissions: '',
                error: '',
                error_description: '',
            });

            when(guildRepositoryMock.cUpdate(anything())).thenResolve();

            // When
            const redriectPath = await redirectController.botAddCallback(user, res, query);

            // Than
            expect(redriectPath).toBe('/mypage/servers');
        });

        it(`봇 추가 후 메인 주소로 이동한다`, async () => {
            // Given
            const user = AuthUserDto.create({ id: '1', isLogin: true });
            const res: any = {
                redirect: (path: string) => path,
            };
            const query = plainToInstance(DiscordCallbackRequestDto, {
                redirect: '',
                guild_id: '',
                code: '',
                permissions: '',
                error: '',
                error_description: '',
            });

            when(guildRepositoryMock.cUpdate(anything())).thenResolve();

            // When
            const redriectPath = await redirectController.botAddCallback(user, res, query);

            // Than
            expect(redriectPath).toBe('/');
        });

        it(`봇 추가 후 비로그인이면 로그인 주소로 이동한다`, async () => {
            // Given
            const user = AuthUserDto.create({ id: undefined, isLogin: false });
            const res: any = {
                redirect: (path: string) => path,
            };
            const query = plainToInstance(DiscordCallbackRequestDto, {
                redirect: '',
                guild_id: '',
                code: '',
                permissions: '',
                error: '',
                error_description: '',
            });

            when(guildRepositoryMock.cUpdate(anything())).thenResolve();

            // When
            const redriectPath = await redirectController.botAddCallback(user, res, query);

            // Than
            expect(redriectPath).toBe('/auth/login');
        });
    });

    describe('serverInvite', () => {
        it(`서버 초대 주소로 이동한다`, async () => {
            // Given
            const res: any = {
                redirect: (path: string) => path,
            };
            const param = plainToInstance(ParamIdStringRequestDto, {
                id: '1',
            });
            const dataMock: any = {
                invite_code: 'inviteCode',
            };

            when(guildRepositoryMock.cFindOne(anything())).thenResolve(dataMock);

            // When
            const redriectPath = await redirectController.serverInvite(res, param);

            // Than
            expect(redriectPath).toBe(DISCORD_CONFIG.SERVER_INVITE_URL(dataMock.invite_code));
        });

        it(`서버가 없으면 이전 주소로 이동한다`, async () => {
            // Given
            const res: any = {
                redirect: (path: string) => path,
            };
            const param = plainToInstance(ParamIdStringRequestDto, {
                id: '1',
            });
            const dataMock = undefined;

            when(guildRepositoryMock.cFindOne(anything())).thenResolve(dataMock);

            // When
            const redriectPath = await redirectController.serverInvite(res, param);

            // Than
            expect(redriectPath).toBe('back');
        });
    });
});
