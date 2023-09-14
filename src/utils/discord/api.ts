// @nestjs
import { HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
// lib
import { lastValueFrom } from 'rxjs';
// messages
import { DISCORD_ERROR_MESSAGES } from '@common/messages';

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
    } catch (error) {
        const errorFormat = errorHandler(error, 'get', url);
        throw new HttpException(errorFormat.customMessage, errorFormat.status);
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
    } catch (error) {
        const errorFormat = errorHandler(error, 'post', url);
        throw new HttpException(errorFormat.customMessage, errorFormat.status);
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

function errorHandler(error: any, method: string, url: string) {
    const response = error?.response;
    if (response) {
        const status = response?.status;
        const data = response?.data;

        if (status === 429) {
            if (data === 'error code: 1015') {
                return {
                    method,
                    url,
                    status,
                    customMessage: `요청이 제한되었습니다.`,
                };
            } else {
                const seconds = (data.retry_after / 1000) % 60;

                return {
                    method,
                    url,
                    status,
                    customMessage: `${seconds}초 이후 다시 시도해주세요.`,
                };
            }
        } else {
            return {
                url,
                status: status,
                customMessage: DISCORD_ERROR_MESSAGES[`E${data.code}`] || data.message,
            };
        }
    } else {
        return {
            url,
            status: HttpStatus.BAD_REQUEST,
            customMessage: '잘못된 요청입니다.',
        };
    }
}
