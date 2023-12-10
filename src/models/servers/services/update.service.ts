// types
import type { Save, SaveValues } from '../types/save.type';
// @nestjs
import { Injectable, HttpException, HttpStatus, BadRequestException, NotFoundException, Logger } from '@nestjs/common';
// lib
import { DataSource } from 'typeorm';
import dayjs from '@lib/dayjs';
import { isEmpty } from '@lib/lodash';
// utils
import { timePassed, generateSnowflakeId } from '@utils/index';
// messages
import { ERROR_MESSAGES } from '@common/messages';
// services
import { DiscordApiService } from '@models/discord-api/discordApi.service';
// repositories
import { TagRepository } from '@databases/repositories/tag';
import { GuildRepository } from '@databases/repositories/guild';

// ----------------------------------------------------------------------

@Injectable()
export class ServersUpdateService {
    private readonly logger = new Logger(ServersUpdateService.name);

    /**************************************************
     * Constructor
     **************************************************/
    constructor(
        private readonly dataSource: DataSource,

        private readonly discordApiService: DiscordApiService,

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
    async edit(serverId: string, userId: string, saveValues: Partial<SaveValues>): Promise<Save> {
        const {
            serverOpen,
            categoryId,
            linkType,
            inviteAuto,
            inviteCode,
            channelId,
            membershipUrl,
            tags,
            summary,
            content,
            contentType,
        } = saveValues;

        let newInviteCode = inviteCode;

        const queryRunner = this.dataSource.createQueryRunner();
        try {
            const myGuild = await this.guildRepository.selectMyGuildOne({
                select: {
                    columns: {
                        id: true,
                    },
                },
                where: {
                    id: serverId,
                    user_id: userId,
                },
            });
            if (!myGuild) {
                throw new BadRequestException(ERROR_MESSAGES.SERVER_NOT_FOUND_OR_NOT_PERMISSION);
            }

            /**
             * - 자동으로 초대코드를 생성하는거면 코드를 생성한다.
             * - 초대코드가 유효한지 검사한다.
             */
            if (linkType === 'invite') {
                if (inviteAuto === 'auto') {
                    const invites = await this.discordApiService.channels().createInvites(channelId);

                    newInviteCode = invites.code;
                }

                await this.discordApiService.invites().detail(newInviteCode);
            }

            await queryRunner.startTransaction();

            // 서버 수정
            await this.guildRepository.cUpdate({
                transaction: queryRunner,
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
                    id: serverId,
                },
            });

            // 이전 태그 삭제
            await this.tagRepository.cDelete({
                transaction: queryRunner,
                where: {
                    guild_id: serverId,
                },
            });

            // 현재 태그 추가
            const tagsLength = tags.length;
            if (tagsLength > 0) {
                const formatTags = [];

                for (let i = 0; i < tagsLength; i++) {
                    const tag = tags[i];

                    formatTags.push({
                        id: generateSnowflakeId(),
                        guild_id: serverId,
                        name: tag.name,
                        sort: i,
                    });
                }
                await this.tagRepository.cInsert({
                    transaction: queryRunner,
                    values: formatTags,
                });
            }

            await queryRunner.commitTransaction();

            return { id: serverId };
        } catch (error: any) {
            this.logger.error(error.message, error.stack);

            if (queryRunner.isTransactionActive) {
                await queryRunner.rollbackTransaction();
            }

            throw new HttpException(error.message || ERROR_MESSAGES.E400, error.status || HttpStatus.BAD_REQUEST);
        } finally {
            await queryRunner.release();
        }
    }

    /**
     * 서버 새로고침
     * @param {string} guildId
     * @param {string} userId
     */
    async refresh(guildId: string, userId: string): Promise<{ result: boolean }> {
        try {
            const myServer = await this.guildRepository.selectMyGuildOne({
                select: {
                    columns: {
                        refresh_date: true,
                    },
                },
                where: {
                    id: guildId,
                    user_id: userId,
                },
            });
            if (isEmpty(myServer)) {
                throw new NotFoundException(ERROR_MESSAGES.SERVER_NOT_FOUND);
            }

            const minutes = 60 * 10;
            const { isTimePassed, currentDate, compareDate } = timePassed(myServer.refresh_date as string, minutes);

            if (!isTimePassed) {
                const minutes = dayjs.duration(dayjs(compareDate).diff(currentDate)).minutes();
                const seconds = dayjs.duration(dayjs(compareDate).diff(currentDate)).seconds();

                const timeRemainning = minutes !== 0 ? `${minutes}분` : `${seconds}초`;
                throw new HttpException(`${timeRemainning} 후 다시 시도해주세요.`, HttpStatus.BAD_REQUEST);
            }

            const discordGuild = await this.discordApiService.guilds().detail(guildId);

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

            return { result: true };
        } catch (error: any) {
            this.logger.error(error.message, error.stack);

            if (error.status === 403) {
                await this.guildRepository.cUpdate({
                    values: {
                        is_bot: 0,
                    },
                    where: {
                        id: guildId,
                    },
                });

                throw new HttpException(error.message || ERROR_MESSAGES.BOT_NOT_FOUND, HttpStatus.FORBIDDEN);
            } else {
                throw new HttpException(error.message, error.status || HttpStatus.BAD_REQUEST);
            }
        }
    }
}
