// types
import type { AdminGuild } from '../ts/interfaces/users.interface';
// lib
import { Injectable } from '@nestjs/common';

// ----------------------------------------------------------------------

@Injectable()
export class UtilHelper {
    /**************************************************
     * Public Methods
     **************************************************/
    /**
     * 관리자 권한이 있는 길드 목록을 가져온다.
     * @param userId
     * @param adminGuilds
     */
    getGuildByGuildId(guildId: string, adminGuilds: AdminGuild[]): AdminGuild | undefined {
        let guild = undefined;

        for (let i = adminGuilds.length - 1; i >= 0; i--) {
            const adminGuild = adminGuilds[i];

            if (adminGuild.id === guildId) {
                guild = adminGuild;
                break;
            }
        }

        return guild;
    }

    /**************************************************
     * Private Methods
     **************************************************/
}
