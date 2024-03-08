// lib
import { CookieOptions } from 'express';
// configs
import { ENV_CONFIG } from './env.config';
import { BASE_CONFIG } from './basic.config';

// ----------------------------------------------------------------------

export const COOKIE_PARSER_OPTIONS = {
    secret: ENV_CONFIG.COOKIE_SECRET,
} as const;

export const cookieOptions = (expires?: Date): CookieOptions => ({
    domain: BASE_CONFIG.DOMAIN,
    httpOnly: true,
    secure: ENV_CONFIG.IS_DEV_MODE ? false : true,
    expires: expires || undefined,
});
