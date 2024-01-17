// @nestjs
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
// messages
import { AUTH_ERROR_MESSAGES } from '@common/messages';

// ----------------------------------------------------------------------

@Injectable()
export class AuthGuardUserMe extends AuthGuard('jwt') {
    override handleRequest(error: any, user: any) {
        if (error || !user) {
            const information = {
                auth: 'jwt',
                isRedirect: false,
                message: AUTH_ERROR_MESSAGES.LOGIN_PLEASE,
            };

            throw error || new UnauthorizedException(information);
        }

        return user;
    }
}
