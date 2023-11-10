// types
import type { AdminGuild } from '../types/users.type';
import type { Channel } from '@models/discord-api/types/discordApi.type';
// lib
import { Injectable } from '@nestjs/common';
import { isEmpty, isNotEmpty } from '@lib/lodash';
// flags
import { permissionFlags } from '@utils/discord/flags/permission.flag';
// services
import { DiscordApiService } from '@models/discord-api/discordApi.service';
// repositories
import { GuildRepository } from '@databases/repositories/guild';

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
     * 디스코드의 관리자 길드 목록 중 디스니티에 등록된 관리자 길드를 제외한다.
     * @param {AdminGuild[]} discordAdminGuilds
     */
    async removeRegisteredGuild(discordAdminGuilds: AdminGuild[]): Promise<AdminGuild[]> {
        if (isEmpty(discordAdminGuilds)) return [];

        const discordAdminGuildIds = discordAdminGuilds.map((discordAdminGuild) => discordAdminGuild.id);
        const guilds = await this.guildRepository.selectMany<'publicList'>({
            select: {
                sql: {
                    publicList: true,
                },
            },
            where: {
                IN: {
                    ids: discordAdminGuildIds,
                },
            },
        });
        const guildIds = guilds.map((guild) => guild.id);

        const newAdminGuilds = discordAdminGuilds.filter((discordAdminGuild) => {
            if (!guildIds.includes(discordAdminGuild.id)) {
                return discordAdminGuild;
            }
        });

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

            if (
                channel.type === 0 ||
                channel.type === 2 ||
                channel.type === 5 ||
                channel.type === 13 ||
                channel.type === 15
            ) {
                if (isNotEmpty(channel?.permission_overwrites)) {
                    const permissionLength = channel?.permission_overwrites.length;

                    for (let j = 0; j < permissionLength; j++) {
                        const permission = channel?.permission_overwrites[j];

                        if (permission.deny === 0 && permission.deny_new === '0') {
                            channels.push(channel);
                            break;
                        } else if (!(permission.deny & permissionFlags.CREATE_INSTANT_INVITE)) {
                            channels.push(channel);
                            break;
                        }
                    }
                } else if (isEmpty(channel?.permission_overwrites)) {
                    channels.push(channel);
                }
            }
        }

        return channels;
    }

    /**************************************************
     * Private Methods
     **************************************************/
}
