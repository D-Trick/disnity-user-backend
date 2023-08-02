// types
import type { DiscordLoginUser } from '@models/users/ts/interfaces/users.interface';
import type { Request as _Request } from 'express';

// ----------------------------------------------------------------------

interface DiscrodLoginUserRequest extends DiscordLoginUser {
    loginRedirect?: string;
    accessDenied?: string;
}

export interface IRequest extends _Request {
    user: DiscrodLoginUserRequest;
}
