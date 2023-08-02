// types
import type { AdminGuild } from '../ts/interfaces/users.interface';
import type { Select } from '@databases/ts/types/guild.type';
import type { Channel } from '@models/discord-api/ts/interfaces/discordApi.interface';
// lib
import { Injectable } from '@nestjs/common';
import { isNotEmpty } from '@lib/lodash';
// flags
import { permissionFlags } from '@lib/discord/flags/permission.flag';
// services
import { DiscordApiService } from '@models/discord-api/discordApi.service';
// repositorys
import { GuildRepository } from '@databases/repositories/guild.repository';

// ----------------------------------------------------------------------

@Injectable()
export class FilterHelper {
    /**************************************************
     * Constructor
     **************************************************/
    constructor(
        private readonly discordApiService: DiscordApiService,

        private readonly guildRepository: GuildRepository,
    ) {}

    /**************************************************
     * Public Methods
     **************************************************/
    /**
     * 관리자 권한이 있는 길드 목록으로 필터한다.
     * @param {string} userId
     * @param {AdminGuild[]} adminGuilds
     */
    async adminGuildsFilter(userId: string, adminGuilds: AdminGuild[]): Promise<AdminGuild[]> {
        const myServers = await this.guildRepository.selectMany({
            where: {
                user_id: userId,
            },
        });

        const newAdminGuilds = this.removeRegisteredServer(adminGuilds, myServers);

        return newAdminGuilds;
    }

    /**
     * 초대코드 생성 권한이 있는 채널 목록으로 필터한다.
     * @param {string} guildId
     */
    async inviteCodeCreatePermissionChannelsFilter(guildId: string): Promise<Channel[]> {
        const channels = [];

        const guildChannels = await this.discordApiService.guilds().channels(guildId);

        const length = guildChannels.length;
        for (let i = 0; i < length; i++) {
            const channel = guildChannels[i];

            if (channel.type === 0 || channel.type === 2) {
                if (isNotEmpty(channel?.permission_overwrites)) {
                    const permissionLength = channel?.permission_overwrites.length;
                    for (let j = 0; j < permissionLength; j++) {
                        const permission = channel?.permission_overwrites[j];
                        if (!(permission.deny & permissionFlags.CREATE_INSTANT_INVITE)) {
                            channels.push(channel);
                            break;
                        }
                    }
                }
            }
        }

        return channels;
    }

    /**************************************************
     * Private Methods
     **************************************************/
    /**
     * 이미 등록된 서버 제거
     * @param {AdminGuild[]} adminGuilds
     * @param {Select[]} compareServers
     */
    private removeRegisteredServer(adminGuilds: AdminGuild[], compareServers: Select[]): AdminGuild[] {
        const result = [];

        const length = adminGuilds.length;
        for (let i = 0; i < length; i++) {
            const adminGuild = adminGuilds[i];
            let isSameGuild = false;

            const length2 = compareServers.length;
            for (let j = 0; j < length2; j++) {
                const compareServer = compareServers[j];

                if (adminGuild.id === compareServer.id) {
                    isSameGuild = true;
                    break;
                }
            }

            if (!isSameGuild) result.push(adminGuild);
        }

        return result;
    }
}
