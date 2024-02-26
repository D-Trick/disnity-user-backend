// test
import { USER_MOCK, getDiscordUser } from 'test/mock/utils/discord-login';
// utils
import { DiscordApi } from '@utils/discord/api';
// configs
import { DISCORD_CONFIG } from '@config/discord.config';

// ----------------------------------------------------------------------

describe('디스코드 API 테스트', () => {
    let ACCESS_TOKEN = '';

    beforeAll(async () => {
        const user = await getDiscordUser();

        ACCESS_TOKEN = user.access_token;
    });

    it(`디스코드 유저정보 API 요청해서 정보를 가져온다.`, async () => {
        // Given
        const URL = `${DISCORD_CONFIG.URLS.API}/users/@me`;

        // When
        const { data } = await DiscordApi.get(URL, {
            authType: DISCORD_CONFIG.APP.AUTH_TYPE,
            token: ACCESS_TOKEN,
        });

        // Than
        expect({ email: data.email }).toStrictEqual({ email: USER_MOCK.email });
    });

    it(`API 요청시 Http 오류 이면 예외를 발생한다`, async () => {
        // Given
        const URL = `${DISCORD_CONFIG.URLS.API}/users/@meme`;

        // When
        const result = async () =>
            DiscordApi.get(URL, {
                authType: DISCORD_CONFIG.APP.AUTH_TYPE,
                token: ACCESS_TOKEN,
            });

        // Than
        expect(result).rejects.toThrow();
    });
});
