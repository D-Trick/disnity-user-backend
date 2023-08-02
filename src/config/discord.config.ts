// configs
import { ENV_CONFIG } from './env.config';
import { baseConfig } from './basic.config';

// ----------------------------------------------------------------------
const APP = {
    CLIENT_ID: ENV_CONFIG.IS_DEV_MODE ? '838339025768153088' : '670236838610599939',
    CLIENT_SECRET: ENV_CONFIG.DISCORD_APP_CLIENT_SECRET,
    AUTH_TYPE_BEARER: 'Bearer',
    SCOPE: 'identify email guilds',
};

const BOT = {
    BOT_TOKEN: ENV_CONFIG.DISCORD_BOT_TOKEN,
    AUTH_TYPE_BOT: 'Bot',
    BOT_SCOPE: 'bot applications.commands',
    BOT_PERMISSION: 1,
};
// ----------------------------------------------------------------------

const { url } = baseConfig;

export const DISCORD_URL = 'https://discord.com';
export const DISCORD_INVITE_URL = 'https://discord.gg';
export const DISCORD_CDN_URL = 'https://cdn.discordapp.com';

const DISCORD_URL_LIST = {
    API_URL: `${DISCORD_URL}/api`,
    AUTH_URL: `${DISCORD_URL}/api/oauth2/authorize`,
    TOKEN_URL: `${DISCORD_URL}/api/oauth2/token`,
    INVITE_URL: `${DISCORD_URL}/invite`,
    ICON_URL: `${DISCORD_CDN_URL}/icons`,
    EMOJI_URL: `${DISCORD_CDN_URL}/emojis`,
    BANNER_URL: `${DISCORD_CDN_URL}/banners`,
    SPLASH_URL: `${DISCORD_CDN_URL}/splashes`,
    AVATAR_URL: `${DISCORD_CDN_URL}/avatars`,
};

const CALLBACK_URL = {
    LOGIN_REDIRECT_URL: `${url}/auth/login/callback`,
    BOT_REDIRECT_CREATE_URL: `${url}/redirect/bot-add/callback?redirect=create`,
    BOT_REDIRECT_MYPAGE_URL: `${url}/redirect/bot-add/callback?redirect=mypage`,
};

const ETC_URL = {
    LOGIN_URI: `${DISCORD_URL_LIST.AUTH_URL}?redirect_uri=${CALLBACK_URL.LOGIN_REDIRECT_URL}&client_id=${APP.CLIENT_ID}&scope=${APP.SCOPE}&response_type=code`,
    BOT_INVITE_REDIRECT_CREATE_URI: `${DISCORD_URL_LIST.AUTH_URL}?redirect_uri=${CALLBACK_URL.BOT_REDIRECT_CREATE_URL}&client_id=${APP.CLIENT_ID}&response_type=code&approval_prompt=auto&permissions=${BOT.BOT_PERMISSION}&scope=${BOT.BOT_SCOPE}&disable_guild_select=true`,
    BOT_INVITE_REDIRECT_MYPAGE_URI: `${DISCORD_URL_LIST.AUTH_URL}?redirect_uri=${CALLBACK_URL.BOT_REDIRECT_MYPAGE_URL}&client_id=${APP.CLIENT_ID}&response_type=code&approval_prompt=auto&permissions=${BOT.BOT_PERMISSION}&scope=${BOT.BOT_SCOPE}&disable_guild_select=true`,
};

export const discordConfig = {
    ...APP,
    ...BOT,
    ...CALLBACK_URL,
    ...DISCORD_URL_LIST,
    ...ETC_URL,
};
