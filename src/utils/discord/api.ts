// @nestjs
import axios from 'axios';
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
// ----------------------------------------------------------------------

export class DiscordApi {
    static async get(url: string, config: Config) {
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
            const { data } = await axios.get(url, options);

            return { data };
        } catch (error: any) {
            this.errorHandler(url, error);
        }
    }

    static async post(url: string, body: object, config: Config) {
        try {
            const { authType, token } = config;

            const options = {
                headers: {
                    'Content-Type': `application/json`,
                    Authorization: `${authType} ${token}`,
                    'Accept-Encoding': 'gzip,deflate,compress',
                },
            };
            const { data } = await axios.post(url, body, options);

            return { data };
        } catch (error: any) {
            this.errorHandler(url, error);
        }
    }

    /**
     * Error Handler
     * @param {any} error
     */
    private static errorHandler(url: string, error: any) {
        const response = error?.response;

        if (response) {
            const { status, data } = response;

            let message = DISCORD_API_ERROR_MESSAGES[`${data?.code}`];

            if (status === 429) {
                message = this.format429Message(data);
            } else if (status === 403) {
                message = this.format403Message(url, data?.code);
            }

            throw new DiscordApiException(status, url, message || data?.message);
        }

        throw error;
    }

    private static format429Message(data: any) {
        if (!!data?.retry_after) {
            const seconds = (data.retry_after / 1000) % 60;

            return `${seconds}초 이후 다시 시도해주세요.`;
        }

        return '요청이 제한되었습니다.';
    }

    private static format403Message(url: string, errorCode: number) {
        if (errorCode === 50013) {
            if (url.includes('/channels') && url.includes('/invites')) {
                return DISCORD_ERROR_MESSAGES.CHANNEL_INVITE_CODE_NO_CREATE_PERMISSION;
            }
        }

        return DISCORD_API_ERROR_MESSAGES[`${errorCode}`];
    }
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
