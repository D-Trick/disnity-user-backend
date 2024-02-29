// configs
import { ENV_CONFIG } from './env.config';
import { BASE_CONFIG } from './basic.config';

// ----------------------------------------------------------------------
const APP = {
    CLIENT_ID: ENV_CONFIG.IS_DEV_MODE ? '838339025768153088' : '670236838610599939',
    CLIENT_SECRET: ENV_CONFIG.DISCORD_APP_CLIENT_SECRET,
    AUTH_TYPE: 'Bearer',
    SCOPE: 'identify email guilds',
} as const;

const BOT = {
    TOKEN: ENV_CONFIG.DISCORD_BOT_TOKEN,
    AUTH_TYPE: 'Bot',
    SCOPE: 'bot applications.commands',
    PERMISSION: 1,
} as const;
// ----------------------------------------------------------------------

const URL = 'https://discord.com' as const;
const CDN_URL = 'https://cdn.discordapp.com' as const;
const INVITE_URL = 'https://discord.gg' as const;

const URLS = {
    API: `${URL}/api`,
    AUTH: `${URL}/api/oauth2/authorize`,
    TOKEN: `${URL}/api/oauth2/token`,
    INVITE: `${URL}/invite`,
} as const;

const CDN_URLS = {
    ICON: `${CDN_URL}/icons`,
    EMOJI: `${CDN_URL}/emojis`,
    BANNER: `${CDN_URL}/banners`,
    AVATAR: `${CDN_URL}/avatars`,
    SPLASH: `${CDN_URL}/splashes`,
} as const;

const CALLBACK_URLS = {
    LOGIN: `${BASE_CONFIG.URL}/auth/login/callback`,
    BOT_ADD: (type: string) => `${BASE_CONFIG.URL}/redirect/bot-add/callback?redirect=${type}`,
} as const;

const LOGIN_URL =
    `${URLS.AUTH}?redirect_uri=${CALLBACK_URLS.LOGIN}&client_id=${APP.CLIENT_ID}&scope=${BOT.SCOPE}&response_type=code` as const;

const BOT_INVITE_URL = (type: string, guildId: string) => {
    let URL = URLS.AUTH;
    URL += `?redirect_uri=${CALLBACK_URLS.BOT_ADD(type)}`;
    URL += `&client_id=${APP.CLIENT_ID}`;
    URL += `&response_type=code`;
    URL += `&approval_prompt=auto`;
    URL += `&permissions=${BOT.PERMISSION}`;
    URL += `&scope=${BOT.SCOPE}`;
    if (guildId) {
        URL += `&disable_guild_select=true`;
        URL += `&guild_id=${guildId}`;
    }

    return URL;
};

const SERVER_INVITE_URL = (code: string) => {
    return `${INVITE_URL}/${code}`;
};
// ----------------------------------------------------------------------

export const DISCORD_CONFIG = {
    APP,
    BOT,

    URL,
    CDN_URL,
    INVITE_URL,

    URLS,
    CDN_URLS,
    CALLBACK_URLS,

    LOGIN_URL,
    BOT_INVITE_URL,
    SERVER_INVITE_URL,
} as const;
