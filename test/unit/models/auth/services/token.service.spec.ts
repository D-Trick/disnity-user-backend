// test
import { Test } from '@nestjs/testing';
import { anyString } from 'ts-mockito';
// @nestjs
import { JwtModule } from '@nestjs/jwt';
// configs
import { jwtConfig } from '@config/jwt.config';
// services
import { AuthTokenService } from '@models/auth/services/token.service';

// ----------------------------------------------------------------------

describe('AuthTokenService 테스트를 시작합니다.', () => {
    let authTokenService: AuthTokenService;

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [JwtModule.register(jwtConfig)],
            providers: [AuthTokenService],
        }).compile();

        authTokenService = moduleRef.get<AuthTokenService>(AuthTokenService);
    });

    it(`token을 생성한다.`, async () => {
        // given
        const jwtPattern = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_.+/=]+$/;

        // When
        const accessToken = authTokenService.createJwtToken('access', anyString());
        const refreshToken = authTokenService.createJwtToken('refresh', anyString());

        // Than
        expect(accessToken).toMatch(jwtPattern);
        expect(refreshToken).toMatch(jwtPattern);
    });
});
