// types
import type { AdminGuild } from '@models/users/ts/interfaces/users.interface';
// configs
import { permissionFlags } from './flags/permission.flag';

/**
 * 관리자, 서버관리자 인지 검사
 * @param permissions
 * @returns true or false
 */
export function checkAdminPermissionGuild(permissions: number) {
    const { ADMINISTRATOR, MANAGE_GUILD } = permissionFlags;

    if ((permissions & ADMINISTRATOR) == ADMINISTRATOR || (permissions & MANAGE_GUILD) == MANAGE_GUILD) {
        return true;
    }

    return false;
}

/**
 * 관리자권한이 있는 길드 목록 가져오기
 * @param {AdminGuild} guilds
 * @returns 관리자권한이 있는 길드목록
 */
export function getAdminGuilds(guilds: AdminGuild[]): AdminGuild[] {
    const adminGuilds = [];
    for (let i = 0, length = guilds.length; i < length; i++) {
        const guild = guilds[i];

        if (checkAdminPermissionGuild(guild.permissions)) {
            adminGuilds.push(guild);
        }
    }

    return adminGuilds;
}