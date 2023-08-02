// @nestjs
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
// messages
import { ERROR_MESSAGES } from '@common/messages';

// ----------------------------------------------------------------------
const { LOGIN_PLEASE } = ERROR_MESSAGES;
// ----------------------------------------------------------------------

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    handleRequest(error: any, user: any) {
        const isNotLogin = !user || error ? true : false;

        if (isNotLogin) {
            throw error || new UnauthorizedException({ auth: 'jwt', isRedirect: true, message: LOGIN_PLEASE });
        }

        return {
            ...user,
        };
    }
}
