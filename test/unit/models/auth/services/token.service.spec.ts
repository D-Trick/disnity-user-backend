// test
import { Test } from '@nestjs/testing';
import { anyString } from 'ts-mockito';
// @nestjs
import { JwtModule } from '@nestjs/jwt';
// configs
import { JWT_MODULE_CONFIG } from '@config/jwt.config';
// services
import { AuthTokenService } from '@models/auth/services/token.service';

// ----------------------------------------------------------------------

describe('AuthTokenService', () => {
    let authTokenService: AuthTokenService;

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [JwtModule.register(JWT_MODULE_CONFIG)],
            providers: [AuthTokenService],
        }).compile();

        authTokenService = moduleRef.get<AuthTokenService>(AuthTokenService);
    });

    describe('createJwt', () => {
        it(`token을 생성한다.`, async () => {
            // given
            const jwtPattern = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_.+/=]+$/;

            // When
            const accessToken = authTokenService.createJwt('access', anyString());
            const refreshToken = authTokenService.createJwt('refresh', anyString());

            // Than
            expect(accessToken).toMatch(jwtPattern);
            expect(refreshToken).toMatch(jwtPattern);
        });
    });
});
