// @nestjs
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
// dtos
import { AuthDiscordUserDto } from '@models/auth/dtos/auth-discord-user.dto';

// ----------------------------------------------------------------------

@Injectable()
export class AuthGuardDiscord extends AuthGuard('discord') {
    override handleRequest(error: any, user: any, info: any, context: any): any {
        const aUser: AuthDiscordUserDto | false = user;
        const request = context.switchToHttp().getRequest();

        if (error || !aUser) {
            throw new UnauthorizedException({ redirect: '/' });
        } else if (request.query.error === 'access_denied') {
            throw new UnauthorizedException({ redirect: '/' });
        }

        return aUser;
    }
}
