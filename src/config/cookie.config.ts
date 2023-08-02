// lib
import { CookieOptions } from 'express';
// configs
import { DOMAIN } from './basic.config';
import { ENV_CONFIG } from './env.config';

// ----------------------------------------------------------------------

export const cookieConfig = {
    secret: ENV_CONFIG.COOKIE_SECRET,
};

export const getCookieOptions = (expires?: Date): CookieOptions => {
    const options: CookieOptions = {
        domain: DOMAIN,
        httpOnly: true,
        secure: ENV_CONFIG.IS_DEV_MODE ? false : true,
        expires: expires || undefined,
    };

    return options;
};
