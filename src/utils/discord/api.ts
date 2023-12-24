// @nestjs
import { HttpService } from '@nestjs/axios';
// lib
import { lastValueFrom } from 'rxjs';
// exceptions
import { DiscordApiException } from '@exceptions/discord-api.exception';
// messages
import { DISCORD_API_ERROR_MESSAGES, DISCORD_ERROR_MESSAGES } from '@common/messages';

// ----------------------------------------------------------------------
interface Config {
    authType: string;
    token: string;
    refreshToken?: string;
}

interface Retrun {
    data?: any;
    status?: number;
    discordMessage?: string;
}
// ----------------------------------------------------------------------

export async function get(axios: HttpService, url: string, config?: Config): Promise<Retrun> {
    try {
        const { authType, token } = config;

        const options: any = {
            headers: {
                accept: '*/*',
                'Accept-Encoding': 'gzip,deflate,compress',
            },
        };
        if (authType && token) {
            options.headers.Authorization = `${authType} ${token}`;
        }
        const { data } = await lastValueFrom(axios.get(url, options));

        return { data };
    } catch (error: any) {
        errorHandler(url, error);
    }
}

export async function post(axios: HttpService, url: string, body: object, config: Config): Promise<Retrun> {
    try {
        const { authType, token } = config;

        const options = {
            headers: {
                'Content-Type': `application/json`,
                Authorization: `${authType} ${token}`,
                'Accept-Encoding': 'gzip,deflate,compress',
            },
        };
        const { data } = await lastValueFrom(axios.post(url, body, options));

        return { data };
    } catch (error: any) {
        errorHandler(url, error);
    }
}

/**
 * Error Handler
 * @param {any} error
 */
function errorHandler(url: string, error: any) {
    const response = error?.response;

    if (response) {
        const { status, data } = response;

        let message = DISCORD_API_ERROR_MESSAGES[`${data?.code}`];

        if (status === 429) {
            if (!!data?.retry_after) {
                const seconds = (data.retry_after / 1000) % 60;

                message = `${seconds}초 이후 다시 시도해주세요.`;
            } else {
                message = '요청이 제한되었습니다.';
            }
        } else if (status === 403) {
            message = format403Message(url, data?.code);
        }

        throw new DiscordApiException(status, url, message || data?.message);
    }

    throw error;
}

/**
 * Error Handler
 * @param {string} url
 * @param {number} errorCode
 */
function format403Message(url: string, errorCode: number) {
    let message = DISCORD_API_ERROR_MESSAGES[`${errorCode}`];

    if (errorCode === 50013) {
        if (url.includes('/channels') && url.includes('/invites')) {
            message = DISCORD_ERROR_MESSAGES.CHANNEL_INVITE_CODE_NO_CREATE_PERMISSION;
        }
    }

    return message;
}

/*
async function refreshToken(axios: HttpService, token: string): Promise<Retrun> {
    try {
        const body = {
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            grant_type: 'refresh_token',
            refresh_token: token,
        };
        const options = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        };
        const { data } = await lastValueFrom(axios.post(`${API_URL}/oauth2/token`, body, options));

        return { data };
    } catch (error) {
        throw errorHandler(error);
    }
}
*/
