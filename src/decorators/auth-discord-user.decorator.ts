// @nestjs
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
// messages
import { AUTH_ERROR_MESSAGES } from '@common/messages/auth.messages';
// dtos
import { AuthDiscordUserDto } from '@models/auth/dtos/auth-discord-user.dto';

// ----------------------------------------------------------------------

export const AuthDiscordUser = createParamDecorator((_data, ctx: ExecutionContext): AuthDiscordUserDto | undefined => {
    const request = ctx.switchToHttp().getRequest();

    if (request.user === undefined) {
        throw new Error(AUTH_ERROR_MESSAGES.AUTH_GUARD_EQUIRED);
    }

    return request.user;
});
