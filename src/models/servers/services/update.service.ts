// types
import type { SaveValues } from '../types/save.type';
// @nestjs
import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
// lodash
import isEmpty from 'lodash/isEmpty';
// lib
import { DataSource, QueryRunner } from 'typeorm';
// utils
import { timePassed, generateSnowflakeId } from '@utils/index';
// exceptions
import { DiscordApiException } from '@exceptions/discord-api.exception';
// messages
import { DISCORD_ERROR_MESSAGES, SERVER_ERROR_MESSAGES } from '@common/messages';
// services
import { DiscordApiGuildsService } from '@models/discord-api/services/guilds.service';
import { DiscordApiInvitesService } from '@models/discord-api/services/invites.service';
import { DiscordApiChannelsService } from '@models/discord-api/services/channels.service';
// repositories
import { TagRepository } from '@databases/repositories/tag';
import { GuildRepository } from '@databases/repositories/guild';

// ----------------------------------------------------------------------

@Injectable()
export class ServersUpdateService {
    /**************************************************
     * Constructor
     **************************************************/
    constructor(
        private readonly dataSource: DataSource,

        private readonly discordApiGuildsService: DiscordApiGuildsService,
        private readonly discordApiInvitesService: DiscordApiInvitesService,
        private readonly discordApiChannelsService: DiscordApiChannelsService,

        private readonly tagRepository: TagRepository,
        private readonly guildRepository: GuildRepository,
    ) {}

    /**************************************************
     * Public Methods
     **************************************************/
    /**
     * 서버 수정
     * @param {string} userId
     * @param {SaveValues} saveValues
     */
    async edit(serverId: string, userId: string, saveValues: Partial<SaveValues>) {
        const { tags } = saveValues;

        const queryRunner = this.dataSource.createQueryRunner();
        try {
            const myGuild = await this.guildRepository.findMyGuild({
                where: {
                    id: serverId,
                    user_id: userId,
                },
            });
            if (!myGuild) {
                throw new BadRequestException(SERVER_ERROR_MESSAGES.SERVER_NOT_FOUND_OR_NO_PERMISSION);
            }

            await queryRunner.startTransaction();

            // 서버 수정
            await this.guildUpdate(queryRunner, serverId, saveValues);

            // 이전 태그 목록을 삭제후 현재 태그 목록 추가
            const tagsLength = tags.length;
            if (tagsLength > 0) {
                await this.tagsDeleteAndInsert(queryRunner, serverId, tags);
            }

            await queryRunner.commitTransaction();

            return serverId;
        } catch (error) {
            if (queryRunner.isTransactionActive) {
                await queryRunner.rollbackTransaction();
            }

            throw error;
        } finally {
            await queryRunner.release();
        }
    }

    /**
     * 서버 새로고침
     * @param {string} guildId
     * @param {string} userId
     */
    async refresh(guildId: string, userId: string) {
        try {
            const myServer = await this.guildRepository.findMyGuild({
                where: {
                    id: guildId,
                    user_id: userId,
                },
            });
            if (isEmpty(myServer)) {
                throw new NotFoundException(SERVER_ERROR_MESSAGES.SERVER_NOT_FOUND);
            }

            const { isTimePassed, timeRemainningText } = timePassed({
                dateTime: myServer.refresh_date as string,
                unit: 'minute',
                afterTime: 10,
            });
            if (!isTimePassed) {
                throw new BadRequestException(`${timeRemainningText} 후 다시 시도해주세요.`);
            }

            const discordGuild = await this.discordApiGuildsService.detail(guildId);

            await this.guildRepository.cUpdate({
                values: {
                    name: discordGuild.name,
                    banner: discordGuild.banner || null,
                    splash: discordGuild.splash || null,
                    icon: discordGuild.icon || null,
                    member: discordGuild.approximate_member_count,
                    online: discordGuild.approximate_presence_count,
                    premium_tier: discordGuild.premium_tier,
                    refresh_date: isTimePassed ? () => 'now()' : undefined,
                    is_bot: 1,
                },
                where: {
                    id: guildId,
                },
            });

            return true;
        } catch (error) {
            if (error instanceof DiscordApiException) {
                if (error.statusCode === 403 || error.statusCode === 404) {
                    await this.guildRepository.cUpdate({
                        values: {
                            is_bot: 0,
                        },
                        where: {
                            id: guildId,
                        },
                    });

                    error.message = DISCORD_ERROR_MESSAGES.BOT_NOT_FOUND;
                }
            }

            throw error;
        }
    }

    /**************************************************
     * Public Methods
     **************************************************/
    /**
     * 서버 수정
     * @param {QueryRunner} transaction
     * @param {string} guildId
     * @param {Partial<SaveValues>} saveValues
     */
    private async guildUpdate(transaction: QueryRunner, guildId: string, saveValues: Partial<SaveValues>) {
        const {
            serverOpen,
            categoryId,
            linkType,
            inviteAuto,
            channelId,
            inviteCode,
            membershipUrl,
            summary,
            content,
            contentType,
        } = saveValues;

        let newInviteCode = inviteCode;
        if (linkType === 'invite') {
            if (inviteAuto === 'auto') {
                const invites = await this.discordApiChannelsService.createInvites(channelId);

                newInviteCode = invites.code;
            }

            // 초대코드가 유효하지 않으면 예외를 던진다.
            await this.discordApiInvitesService.detail(newInviteCode);
        }

        await this.guildRepository.cUpdate({
            transaction,
            values: {
                category_id: categoryId,
                summary,
                content,
                is_markdown: contentType === 'markdown',
                link_type: linkType,
                invite_code: linkType === 'invite' ? newInviteCode : null,
                membership_url: linkType === 'membership' ? membershipUrl : null,
                is_open: serverOpen === 'public',
            },
            where: {
                id: guildId,
            },
        });
    }

    /**
     * 태그 목록 저장
     * @param {QueryRunner} transaction
     * @param {string} guildId
     * @param {SaveValues['tags']} tags
     */
    private async tagsDeleteAndInsert(transaction: QueryRunner, guildId: string, tags: SaveValues['tags']) {
        const tagList = [...tags];

        await this.tagRepository.cDelete({
            transaction,
            where: {
                guild_id: guildId,
            },
        });

        const insertValues = tagList.map((tag, index) => ({
            id: generateSnowflakeId(),
            guild_id: guildId,
            name: tag.name,
            sort: index,
        }));

        await this.tagRepository.cInsert({
            transaction,
            values: insertValues,
        });
    }
}
