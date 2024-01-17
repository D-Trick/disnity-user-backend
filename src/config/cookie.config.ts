// lib
import { CookieOptions } from 'express';
// configs
import { DOMAIN } from './basic.config';
import { ENV_CONFIG } from './env.config';

// ----------------------------------------------------------------------

export const cookieParserOptions = {
    secret: ENV_CONFIG.COOKIE_SECRET,
};

export const cookieOptions = (expires?: Date): CookieOptions => {
    return {
        domain: DOMAIN,
        httpOnly: true,
        secure: ENV_CONFIG.IS_DEV_MODE ? false : true,
        expires: expires || undefined,
    };
};
