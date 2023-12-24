// @nestjs
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
// messages
import { AUTH_ERROR_MESSAGES } from '@common/messages';

// ----------------------------------------------------------------------

@Injectable()
export class JwtAuth2Guard extends AuthGuard('jwt') {
    handleRequest(error: any, user: any) {
        const isNotLogin = !user || error ? true : false;

        if (isNotLogin) {
            throw (
                error ||
                new UnauthorizedException({ auth: 'jwt', isRedirect: false, message: AUTH_ERROR_MESSAGES.LOGIN_PLEASE })
            );
        }

        return {
            ...user,
        };
    }
}
