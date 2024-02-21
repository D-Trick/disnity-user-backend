// test
import { Test } from '@nestjs/testing';
import { mock, instance, when, anyString, anything } from 'ts-mockito';
// dtos
import { LoginCheckResponseDto, TokenResponseDto } from '@models/auth/dtos';
// controllers
import { AuthController } from '@models/auth/auth.controller';
// services
import { AuthService } from '@models/auth/auth.service';
import { UsersService } from '@models/users/users.service';

// ----------------------------------------------------------------------

describe('AuthController 테스트를 시작합니다.', () => {
    let authController: AuthController;

    const authServiceMock: AuthService = mock(AuthService);
    const usersServiceMock: UsersService = mock(UsersService);

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            controllers: [AuthController],
            providers: [
                { provide: AuthService, useValue: instance(authServiceMock) },
                { provide: UsersService, useValue: instance(usersServiceMock) },
            ],
        }).compile();

        authController = moduleRef.get<AuthController>(AuthController);
    });

    it(`로그인 페이지로 이동합니다.`, async () => {
        // When
        const loginRedirect = authController.login();

        // Than
        expect(loginRedirect).toBe('Discord Login Redirect...');
    });

    describe('디스코드에서 로그인 후 로그인 관련 처리를 하고 리다이렉트를 합니다.', () => {
        it(`정상적으로 처리되면 /login으로 리다이렉트를 합니다.`, async () => {
            // Given
            const res: any = {
                cookie: jest.fn(),
                redirect: jest.fn(),
            };

            when(authServiceMock.createJwtToken('access', anyString())).thenReturn('access token');
            when(authServiceMock.createJwtToken('refresh', anyString())).thenReturn('refresh token');

            when(usersServiceMock.saveLoginUser(anything(), '1.1.1.1')).thenReturn();

            // When
            await authController.loginCallback(anything(), res, anything());

            // Than
            expect(res.redirect).toHaveBeenNthCalledWith(1, '/login');
        });

        it(`정상적으로 처리가 안되면 /auth/login으로 리다이렉트를 합니다.`, async () => {
            // Given
            const res: any = {
                cookie: () => {
                    throw new Error('error');
                },
                redirect: jest.fn(),
            };

            when(authServiceMock.createJwtToken('access', anyString())).thenReturn('access token');
            when(authServiceMock.createJwtToken('refresh', anyString())).thenReturn('refresh token');

            when(usersServiceMock.saveLoginUser(anything(), '1.1.1.1')).thenReturn();

            // When
            await authController.loginCallback(anything(), res, anything());

            // Than
            expect(res.redirect).toHaveBeenNthCalledWith(1, '/auth/login');
        });
    });

    describe('로그아웃을 합니다.', () => {
        it(`성공하면 /logout으로 리다이렉트를 합니다.`, async () => {
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

        it(`실패하면 /으로 리다이렉트를 합니다.`, async () => {
            // Given
            const res: any = {
                clearCookie: () => {
                    throw new Error('error');
                },
                redirect: jest.fn(),
            };

            // When
            authController.logout(res);

            // Than
            expect(res.redirect).toHaveBeenNthCalledWith(1, '/');
        });
    });

    it(`로그인을 했는지 안했는지 검사합니다.`, async () => {
        // When
        const check = authController.check();

        // Than
        expect(check).toEqual(new LoginCheckResponseDto(true));
    });

    describe('토큰을 새로고침 합니다.', () => {
        it(`access, refresh Token을 생성합니다.`, async () => {
            // Given
            const user = {
                id: '1',
                isLogin: true,
            };
            const res: any = {
                cookie: jest.fn(),
            };

            when(authServiceMock.createJwtToken('access', anyString())).thenReturn('access token');
            when(authServiceMock.createJwtToken('refresh', anyString())).thenReturn('refresh token');

            // When
            const token = await authController.tokenRefresh(user, res);

            // Than
            expect(token).toEqual(new TokenResponseDto('access token', 'refresh token'));
        });

        it(`실패하면 에러가 발생합니다.`, async () => {
            // Given
            const user = {
                id: '1',
                isLogin: true,
            };
            const res: any = {
                cookie: () => {
                    throw new Error('error');
                },
            };

            when(authServiceMock.createJwtToken('access', anyString())).thenReturn('access token');
            when(authServiceMock.createJwtToken('refresh', anyString())).thenReturn('refresh token');

            // When
            const wrap = async () => authController.tokenRefresh(user, res);

            // Than
            expect(wrap).rejects.toThrow('error');
        });
    });
});
