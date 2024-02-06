// utils
import { DiscordApi } from '@utils/discord/api';
// configs
import { discordConfig } from '@config/discord.config';
import { USER_MOCK, getDiscordUser } from 'test/mock/utils/discord-login';

// ----------------------------------------------------------------------
const { API_URL, AUTH_TYPE_BEARER } = discordConfig;
// ----------------------------------------------------------------------

describe('디스코드 API 테스트', () => {
    let ACCESS_TOKEN = '';

    beforeAll(async () => {
        const user = await getDiscordUser();

        ACCESS_TOKEN = user.access_token;
    });

    it(`디스코드 유저정보 API 요청해서 정보를 가져온다.`, async () => {
        // Given
        const URL = `${API_URL}/users/@me`;

        // When
        const { data } = await DiscordApi.get(URL, {
            authType: AUTH_TYPE_BEARER,
            token: ACCESS_TOKEN,
        });

        // Than
        expect({ email: data.email }).toStrictEqual({ email: USER_MOCK.email });
    });

    it(`API 요청시 Http 오류 이면 예외를 발생한다`, async () => {
        // Given
        const URL = `${API_URL}/users/@meme`;

        // When
        const result = async () =>
            DiscordApi.get(URL, {
                authType: AUTH_TYPE_BEARER,
                token: ACCESS_TOKEN,
            });

        // Than
        expect(result).rejects.toThrow();
    });
});
