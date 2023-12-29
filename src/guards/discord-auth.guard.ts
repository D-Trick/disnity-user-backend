// @nestjs
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
// messages
import { AuthDiscordUserDto } from '@models/auth/dtos/auth-discord-user.dto';

// ----------------------------------------------------------------------

@Injectable()
export class AuthGuardDiscord extends AuthGuard('discord') {
    override handleRequest(error: any, user: any, info: any, context: any): any {
        let aUser: AuthDiscordUserDto | false = user;
        const request = context.switchToHttp().getRequest();

        if (error || !aUser) {
            aUser = AuthDiscordUserDto.create({ isReLogin: true });
        } else if (request.query.error === 'access_denied') {
            aUser = AuthDiscordUserDto.create({ isReLogin: true });
        }

        return aUser;
    }
}
