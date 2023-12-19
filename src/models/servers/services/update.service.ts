// types
import type { Save, SaveValues } from '../types/save.type';
// @nestjs
import { Injectable, HttpException, HttpStatus, BadRequestException, NotFoundException, Logger } from '@nestjs/common';
// lib
import { DataSource, QueryRunner } from 'typeorm';
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
        const { tags } = saveValues;

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

            await queryRunner.startTransaction();

            // 서버 수정
            await this.guildUpdate(queryRunner, serverId, saveValues);

            // 이전 태그 목록을 삭제후 현재 태그 목록 추가
            const tagsLength = tags.length;
            if (tagsLength > 0) {
                await this.tagsDeleteAndInsert(queryRunner, serverId, tags);
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

            const { isTimePassed, currentDateTime, afterDateTime } = timePassed({
                dateTime: myServer.refresh_date as string,
                unit: 'minute',
                afterTime: 10,
            });

            if (!isTimePassed) {
                const diff = dayjs(afterDateTime).diff(currentDateTime);
                const minutes = dayjs.duration(diff).minutes();
                const seconds = dayjs.duration(diff).seconds();

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
                const invites = await this.discordApiService.channels().createInvites(channelId);

                newInviteCode = invites.code;
            }

            // 초대코드가 유효하지 않으면 예외를 던진다.
            await this.discordApiService.invites().detail(newInviteCode);
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
