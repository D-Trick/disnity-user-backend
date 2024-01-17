// @nestjs
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
// messages
import { AUTH_ERROR_MESSAGES } from '@common/messages';
// dtos
import { AuthUserDto } from '@models/auth/dtos/auth-user.dto';

// ----------------------------------------------------------------------

export const AuthUser = createParamDecorator((_data, ctx: ExecutionContext): AuthUserDto => {
    const request = ctx.switchToHttp().getRequest();

    if (request.user === undefined) {
        throw new Error(AUTH_ERROR_MESSAGES.AUTH_GUARD_EQUIRED);
    }

    return request.user;
});
