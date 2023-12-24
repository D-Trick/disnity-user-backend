// @nestjs
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
// messages
import { AUTH_ERROR_MESSAGES } from '@common/messages';

// ----------------------------------------------------------------------

@Injectable()
export class DiscordAuthGuard extends AuthGuard('discord') {
    handleRequest(err: any, user: any, info: any, context: any) {
        const request = context.switchToHttp().getRequest();

        if (request.query.error === 'access_denied') {
            return { accessDenied: true };
        }

        if (err || !user) {
            throw err || new UnauthorizedException(AUTH_ERROR_MESSAGES.LOGIN_PLEASE);
        }

        return user;
    }
}
