// test
import { Test } from '@nestjs/testing';
import { mock, instance, when } from 'ts-mockito';
// @nestjs
import { JwtModule } from '@nestjs/jwt';
// configs
import { JWT_MODULE_CONFIG } from '@config/jwt.config';
import { DISCORD_CONFIG } from '@config/discord.config';
// dtos
import { AuthDiscordUserDto, AuthUserDto, LoginCheckResponseDto, TokenResponseDto } from '@models/auth/dtos';
// controllers
import { AuthController } from '@models/auth/auth.controller';
// services
import { AuthTokenService } from '@models/auth/services/token.service';
import { UsersStoreService } from '@models/users/services/store.service';

// ----------------------------------------------------------------------

describe('AuthController', () => {
    let authController: AuthController;

    let authTokenService: AuthTokenService;

    const usersStoreServiceMock: UsersStoreService = mock(UsersStoreService);

    const user = AuthUserDto.create({
        id: '1',
        isLogin: true,
    });
    const discordUser = AuthDiscordUserDto.create({
        id: '1',
        username: 'test',
        avatar: '',
        discriminator: '',
        public_flags: 0,
        premium_type: 0,
        flags: 0,
        banner: '',
        accent_color: 0,
        global_name: '닉네임',
        avatar_decoration_data: '',
        banner_color: '',
        mfa_enabled: false,
        locale: '',
        email: '',
        verified: true,
        guilds: [],
        admin_guilds: [],

        access_token: 'aa.aa.aa',
        refresh_token: 'bb.bb.bb',
    });

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [JwtModule.register(JWT_MODULE_CONFIG)],
            controllers: [AuthController],
            providers: [AuthTokenService, { provide: UsersStoreService, useValue: instance(usersStoreServiceMock) }],
        }).compile();

        authController = moduleRef.get<AuthController>(AuthController);
        authTokenService = moduleRef.get<AuthTokenService>(AuthTokenService);
    });

    describe('login', () => {
        it(`디스코드 로그인 URL로 이동한다`, async () => {
            // Given
            const response: any = {
                redirect: jest.fn(),
            };

            // When
            authController.login(response);

            // Than
            expect(response.redirect).toHaveBeenNthCalledWith(1, DISCORD_CONFIG.LOGIN_URL);
        });
    });

    describe('loginCallback', () => {
        it(`로그인을 성공하면 /login으로 이동한다`, async () => {
            // Given
            const request: any = {
                headers: {
                    'x-forwarded-for': '1.1.1.1',
                },
            };
            const response: any = {
                cookie: jest.fn(),
                redirect: jest.fn(),
            };

            when(usersStoreServiceMock.loginUser(discordUser, '1.1.1.1')).thenReturn();

            // When
            await authController.loginCallback(request, response, discordUser);

            // Than
            expect(response.redirect).toHaveBeenNthCalledWith(1, '/login');
        });
    });

    describe('logout', () => {
        it(`로그아웃 후 /logout으로 이동한다`, async () => {
            // Given
            const res: any = {
                clearCookie: jest.fn(),
                redirect: jest.fn(),
            };

            // When
            authController.logout(res);

            // Than
            expect(res.redirect).toHaveBeenNthCalledWith(1, '/logout');
        });
    });

    describe('check', () => {
        it(`로그인 여부를 검사한다.`, async () => {
            // When
            const check = authController.check();

            // Than
            expect(check).toEqual(new LoginCheckResponseDto(true));
        });
    });

    describe('tokenRefresh', () => {
        it(`Access Token, Refresh Token을 새로고침 한다.`, async () => {
            // Given
            const res: any = {
                cookie: jest.fn(),
            };
            const accessToken = authTokenService.createJwt('access', user.id);
            const refreshToken = authTokenService.createJwt('refresh', user.id);

            // When
            const token = await authController.tokenRefresh(user, res);

            // Than
            expect(token).toEqual(new TokenResponseDto(accessToken, refreshToken));
        });
    });
});
