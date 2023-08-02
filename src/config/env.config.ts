// lib
import dotenv from 'dotenv';

// ----------------------------------------------------------------------
dotenv.config({
    path: `.env.${process.env.NODE_ENV}`,
});
// ----------------------------------------------------------------------

export const ENV_CONFIG = {
    // Basic
    MODE: process.env.NODE_ENV,
    IS_DEV_MODE: process.env.NODE_ENV === 'development',
    IS_PROD_MODE: process.env.NODE_ENV === 'production',

    // Redis
    REDIS_HOST: process.env.REDIS_HOST,

    // Database
    DATABASE_HOST: process.env.DATABASE_HOST,
    DATABASE_USERNAME: process.env.DATABASE_USERNAME,
    DATABASE_PASSWORD: process.env.DATABASE_PASSWORD,

    // Jwt
    JWT_SECRET: process.env.JWT_SECRET,

    // Cookie
    COOKIE_SECRET: process.env.COOKIE_SECRET,

    // Discrod
    DISCORD_APP_CLIENT_SECRET: process.env.DISCORD_APP_CLIENT_SECRET,
    DISCORD_BOT_TOKEN: process.env.DISCORD_BOT_TOKEN,
};
