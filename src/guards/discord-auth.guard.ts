// @nestjs
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// ----------------------------------------------------------------------

@Injectable()
export class DiscordAuthGuard extends AuthGuard('discord') {
    handleRequest(err: any, user: any, info: any, context: any) {
        const request = context.switchToHttp().getRequest();

        if (request.query.error === 'access_denied') {
            return { accessDenied: true };
        }

        if (err || !user) {
            throw err || new UnauthorizedException('로그인을 해주세요.');
        }

        return user;
    }
}
