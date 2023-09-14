// types
import type { DiscordLoginUser } from '@models/users/types/users.type';
import type { Request as _Request } from 'express';
import type { Response as _Response } from 'express';

// ----------------------------------------------------------------------
export type ExpressResponse = _Response;
export interface ExpressRequest extends _Request {
    user: DiscrodLoginUserRequest;
}

interface DiscrodLoginUserRequest extends DiscordLoginUser {
    loginRedirect?: string;
    accessDenied?: string;
}
