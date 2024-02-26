// lib
import axios from 'axios';
// configs
import { DISCORD_CONFIG } from '@config/discord.config';

// ----------------------------------------------------------------------
export interface User {
    id: string;
    username: string;
    avatar: string;
    discriminator: string;
    global_name: string;
    locale: string;
    premium_type: string;
    email: string;
    verified: string;

    access_token: string;
    refresh_token: string;
}
// ----------------------------------------------------------------------
export const USER_MOCK = {
    email: '',
    password: '',
};
// ----------------------------------------------------------------------

/**
 * 테스트코드 전용 디스코드 유저정보 가져오기
 */
export async function getDiscordUser() {
    // 1. 로그인
    const { token } = await login();

    // 2. 로그인 정보 확인
    await authorize(token);

    // 3. 인증 후 login callback 주소 가져오기
    const { location } = await authorize2(token);

    // 4. code 가져온후 token 발급 받기
    const code = location.split('=')[1];
    const {
        data: { access_token, refresh_token },
    } = await getToken(code);

    // 5. 로그인한 유저 정보 받기
    const { id, username, avatar, discriminator, global_name, locale, premium_type, email, verified } = await me(token);

    return {
        id,
        username,
        avatar,
        discriminator,
        global_name,
        locale,
        premium_type,
        email,
        verified,

        access_token,
        refresh_token,
    };
}

async function login() {
    try {
        const body = {
            login: USER_MOCK.email,
            password: USER_MOCK.password,
            undelete: false,
            gift_code_sku_id: null,
        };
        const options = {
            headers: {
                'Content-Type': 'application/json',
            },
        };
        const { data } = await axios.post(`${DISCORD_CONFIG.URLS.API}/auth/login`, body, options);

        return data;
    } catch (error) {
        throw new Error('디스코드 로그인 에러');
    }
}

async function authorize(token: string) {
    try {
        const options = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: token,
            },
        };
        const { data } = await axios.get(`${DISCORD_CONFIG.LOGIN_URL}&user_install=false`, options);

        return data;
    } catch (error) {
        throw new Error('디스코드 인증 에러');
    }
}

async function me(token: string) {
    try {
        const options = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: token,
            },
        };
        const { data } = await axios.get(`${DISCORD_CONFIG.URLS.API}/users/@me?with_analytics_token=true`, options);

        return data;
    } catch (error) {
        throw new Error('디스코드 @me 에러');
    }
}

async function authorize2(token: string) {
    try {
        const body = { permissions: '0', authorize: true, user_install: false };
        const options = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: token,
            },
        };
        const { data } = await axios.post(`${DISCORD_CONFIG.LOGIN_URL}`, body, options);

        return data;
    } catch (error) {
        throw new Error('디스코드 인증2 에러');
    }
}

async function getToken(code: string) {
    try {
        const body = {
            grant_type: 'authorization_code',
            code,
            redirect_uri: DISCORD_CONFIG.CALLBACK_URLS.LOGIN,
        };
        const options = {
            auth: {
                username: DISCORD_CONFIG.APP.CLIENT_ID,
                password: DISCORD_CONFIG.APP.CLIENT_SECRET,
            },
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        };
        const { data } = await axios.post(DISCORD_CONFIG.URLS.TOKEN, body, options);

        return { data };
    } catch (error: any) {
        throw new Error('디스코드 token 에러');
    }
}
