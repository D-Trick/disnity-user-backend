// types
import type { AdminGuild } from '@models/users/types/users.type';
// configs
import { permissionFlags } from './flags/permission.flag';

// ----------------------------------------------------------------------

/**
 * 관리자권한이 있는 길드 목록 가져오기
 * @param {AdminGuild} guilds
 */
export function filterAdminGuilds(guilds: AdminGuild[]): AdminGuild[] {
    const adminGuilds = [];
    for (let i = 0, length = guilds.length; i < length; i++) {
        const guild = guilds[i];

        if (isGuildAdminPermission(guild.permissions)) {
            adminGuilds.push(guild);
        }
    }

    return adminGuilds;
}

/**
 * 관리자, 서버관리자 인지 검사
 * @param permissions
 */
export function isGuildAdminPermission(permissions: number) {
    const { ADMINISTRATOR, MANAGE_GUILD } = permissionFlags;

    // 관리자
    if ((permissions & ADMINISTRATOR) == ADMINISTRATOR) {
        return true;
    }

    // 서버 관리자
    if ((permissions & MANAGE_GUILD) == MANAGE_GUILD) {
        return true;
    }

    return false;
}
