// @nestjs
import { HttpException, HttpStatus, Logger } from '@nestjs/common';
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
// ----------------------------------------------------------------------

export async function get(axios: HttpService, url: string, config?: Config): Promise<Retrun> {
    const logger = new Logger('utils/discord/api/get function');

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
        logger.error(error.message, error.stack);

        const errorFormat = errorHandler(error, 'get', url);
        throw new HttpException(errorFormat.customMessage, errorFormat.status);
    }
}

export async function post(axios: HttpService, url: string, body: object, config: Config): Promise<Retrun> {
    const logger = new Logger('utils/discord/api/post function');

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
        logger.error(error.message, error.stack);

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

/**
 * Error Handler
 * @param {any} error
 * @param {string} method
 * @param {string} url
 */
function errorHandler(error: any, method: string, url: string) {
    const response = error?.response;

    // Http 요청 에러
    if (response) {
        const status = response?.status;

        if (status === 429) {
            return exception429Response(response, method, url);
        } else {
            return exceptionAllResponse(response, method, url);
        }
    }

    // 그외 에러
    return exceptionEtcResponse(method, url);
}

/**
 * Http Status 492 예외처리
 * @param {any} response
 * @param {string} method
 * @param {string} url
 */
function exception429Response(response: any, method: string, url: string) {
    const status = response?.status;
    const data = response?.data;

    const common = {
        url,
        status,
        method,
    };

    if (data === 'error code: 1015') {
        return {
            ...common,
            customMessage: `요청이 제한되었습니다.`,
        };
    } else {
        const seconds = (data.retry_after / 1000) % 60;

        return {
            ...common,
            customMessage: `${seconds}초 이후 다시 시도해주세요.`,
        };
    }
}

/**
 * 모든 Http Status 예외처리
 * @param {any} response
 * @param {string} method
 * @param {string} url
 */
function exceptionAllResponse(response: any, method: string, url: string) {
    const status = response?.status;
    const data = response?.data;

    return {
        url,
        status,
        method,
        customMessage: DISCORD_ERROR_MESSAGES[`E${data.code}`] || data.message,
    };
}

/**
 * Http 요청에 의한 예외가 아닌 다른 예외일 경우
 * @param {string} method
 * @param {string} url
 */
function exceptionEtcResponse(method: string, url: string) {
    return {
        url,
        method,
        status: HttpStatus.BAD_REQUEST,
        customMessage: '잘못된 요청입니다.',
    };
}
