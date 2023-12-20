// utils
import { filterAdminGuilds, isGuildAdminPermission } from '@utils/discord';

// ----------------------------------------------------------------------

describe('디스코드 관리자 권한 관련 유틸리티', () => {
    it(`총 관리자, 서버 관리자 권한을 가진 길드 목록을 가져온다`, async () => {
        // Given
        const admins = [
            {
                id: '11111111',
                name: '테스트1',
                icon: null,
                owner: false,
                permissions: 824633718751,
                features: [],
                permissions_new: null,
            },
            {
                id: '22222222',
                name: '테스트2',
                icon: null,
                owner: false,
                permissions: 824633718743,
                features: [],
                permissions_new: null,
            },
        ];

        // When
        const result1 = filterAdminGuilds(admins);

        // Than
        expect(result1).toStrictEqual([
            {
                id: '11111111',
                name: '테스트1',
                icon: null,
                owner: false,
                permissions: 824633718751,
                features: [],
                permissions_new: null,
            },
        ]);
    });

    it(`총 관리자, 서버 관리자 권한이면 통과`, async () => {
        // Given
        const admin = 824633718751;
        const serverAdmin = 824633718775;

        // When
        const result1 = isGuildAdminPermission(admin);
        const result2 = isGuildAdminPermission(serverAdmin);

        // Than
        expect(result1).toBeTruthy();
        expect(result2).toBeTruthy();
    });

    it(`총 관리자, 서버 관리자 권한이 아니면 실패`, async () => {
        // Given
        const notAdmin = 824633718743;

        // When
        const result = isGuildAdminPermission(notAdmin);

        // Than
        expect(result).not.toBeTruthy();
    });
});
