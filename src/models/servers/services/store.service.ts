// types
import type { Save, SaveValues } from '../types/save.type';
// @nestjs
import { Injectable, HttpException, HttpStatus, BadRequestException, Logger } from '@nestjs/common';
// lib
import { DataSource } from 'typeorm';
import { ERROR_MESSAGES } from '@common/messages';
import dayjs from '@lib/dayjs';
import { isNotEmpty, differenceBy, uniq, uniqBy } from '@lib/lodash';
// utils
import { generateSnowflakeId, promiseAllSettled } from '@utils/index';
// cache
import { CACHE_KEYS } from '@cache/redis/keys';
// services
import { CacheService } from '@cache/redis/cache.service';
import { DiscordApiService } from '@models/discord-api/discordApi.service';
// repositories
import { TagRepository } from '@databases/repositories/tag';
import { UserRepository } from '@databases/repositories/user';
import { GuildRepository } from '@databases/repositories/guild';
import { EmojiRepository } from '@databases/repositories/emoji';
import { GuildScheduledRepository } from '@databases/repositories/guild-scheduled';
import { GuildAdminPermissionRepository } from '@databases/repositories/guild-admin-permission';

// ----------------------------------------------------------------------

@Injectable()
export class ServersStoreService {
    private readonly logger = new Logger(ServersStoreService.name);

    /**************************************************
     * Constructor
     **************************************************/
    constructor(
        private readonly dataSource: DataSource,

        private readonly cacheService: CacheService,
        private readonly discordApiService: DiscordApiService,

        private readonly tagRepository: TagRepository,
        private readonly userRepository: UserRepository,
        private readonly emojiRepository: EmojiRepository,
        private readonly guildRepository: GuildRepository,

        private readonly guildScheduledRepository: GuildScheduledRepository,
        private readonly guildAdminPermissionRepository: GuildAdminPermissionRepository,
    ) {}

    /**************************************************
     * Public Methods
     **************************************************/
    /**
     * 서버 등록
     * @param {string} userId
     * @param {SaveValues} saveValues
     */
    async store(userId: string, saveValues: SaveValues): Promise<Save> {
        const {
            id,
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

        let promise1 = undefined;
        let promise2 = undefined;
        let promise3 = undefined;
        let promise4 = undefined;
        let promise5 = undefined;
        let promise6 = undefined;
        let promise7 = undefined;

        const queryRunner = this.dataSource.createQueryRunner();
        try {
            const guild = await this.guildRepository.selectOne({
                select: {
                    columns: {
                        id: true,
                    },
                },
                where: {
                    id,
                },
            });
            if (isNotEmpty(guild)) {
                throw new BadRequestException(ERROR_MESSAGES.SERVER_EXISTE);
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

            const discordGuild = await this.discordApiService.guilds().detail(id);

            await queryRunner.startTransaction();

            // 서버 저장
            promise1 = this.guildRepository.cInsert({
                transaction: queryRunner,
                values: {
                    id: discordGuild.id,
                    user_id: userId,
                    category_id: categoryId,
                    name: discordGuild.name,
                    summary,
                    content,
                    is_markdown: contentType === 'markdown',
                    icon: discordGuild.icon || null,
                    banner: discordGuild.banner || null,
                    splash: discordGuild.splash || null,
                    online: discordGuild.approximate_presence_count,
                    member: discordGuild.approximate_member_count,
                    premium_tier: discordGuild.premium_tier,
                    link_type: linkType,
                    invite_code: linkType === 'invite' ? newInviteCode : null,
                    membership_url: linkType === 'membership' ? membershipUrl : null,
                    is_open: serverOpen === 'public',
                    is_bot: 1,
                },
            });

            // 태그 저장
            const tagsLength = tags.length;
            if (tagsLength > 0) {
                const formatTags = [];

                for (let i = 0; i < tagsLength; i++) {
                    const tag = tags[i];

                    formatTags.push({
                        id: generateSnowflakeId(),
                        guild_id: discordGuild.id,
                        name: tag.name,
                        sort: i,
                    });
                }
                promise2 = this.tagRepository.cInsert({
                    transaction: queryRunner,
                    values: formatTags,
                });
            }

            // 이모지 저장
            const { length: emojisLength } = discordGuild.emojis;
            if (emojisLength > 0) {
                const formatEmojis = [];

                for (let i = 0; i < emojisLength; i++) {
                    const emoji = discordGuild.emojis[i];

                    formatEmojis.push({
                        id: emoji.id,
                        guild_id: discordGuild.id,
                        name: emoji.name,
                        animated: emoji.animated,
                    });
                }
                promise3 = this.emojiRepository.cInsert({
                    transaction: queryRunner,
                    values: formatEmojis,
                });
            }

            // 관리자 저장
            const cacheAdmins = await this.cacheService.get(CACHE_KEYS.DISNITY_BOT_ADMINS(id));
            if (isNotEmpty(cacheAdmins)) {
                const adminIds = [];
                const adminUsers = [];
                const adminPermissions = [];

                const cacheAdminsLength = cacheAdmins.length;
                for (let i = 0; i < cacheAdminsLength; i++) {
                    const admin = cacheAdmins[i];

                    adminIds.push(admin.id);

                    adminUsers.push({
                        id: admin.id,
                        global_name: admin.globalName,
                        username: admin.username,
                        discriminator: admin.discriminator,
                        avatar: admin.avatar,
                    });

                    adminPermissions.push({
                        id: generateSnowflakeId(),
                        user_id: admin.id,
                        guild_id: discordGuild.id,
                    });
                }

                // 관리자 추가
                promise4 = this.guildAdminPermissionRepository.cInsert({
                    transaction: queryRunner,
                    values: adminPermissions,
                });

                // 관리자권한있는 사용자 저장
                const users = await this.userRepository.selectMany({
                    transaction: queryRunner,
                    select: {
                        sql: {
                            base: true,
                        },
                    },
                    where: {
                        IN: {
                            ids: adminIds,
                        },
                    },
                });

                const usersValues = differenceBy(adminUsers, users, 'id');

                if (isNotEmpty(usersValues)) {
                    promise5 = this.userRepository.cInsert({
                        transaction: queryRunner,
                        values: usersValues,
                    });
                } else {
                    promise5 = this.userRepository.cBulkUpdate({
                        transaction: queryRunner,
                        values: adminUsers,
                        where: {
                            IN: {
                                ids: adminIds,
                            },
                        },
                    });
                }
            }

            // 길드 이벤트(일정) 가져오기
            const guildSchedules = await this.discordApiService.guildScheduledEvents().scheduledEvents(discordGuild.id);

            // 길드 이벤트(일정) 저장
            if (isNotEmpty(guildSchedules)) {
                const userIds = [];
                const creators = [];
                const scheduledValues = [];
                for (let i = 0, length = guildSchedules.length; i < length; i++) {
                    const scheduled = guildSchedules[i];

                    scheduledValues.push({
                        id: scheduled.id,
                        guild_id: scheduled.guild_id,
                        channel_id: scheduled.channel_id,
                        creator_id: scheduled?.creator?.id || scheduled.creator_id,
                        name: scheduled.name,
                        description: scheduled.description,
                        scheduled_start_time: dayjs(scheduled.scheduled_start_time).format('YYYY-MM-DD HH:mm:ss'),
                        scheduled_end_time: dayjs(scheduled.scheduled_end_time).format('YYYY-MM-DD HH:mm:ss'),
                        privacy_level: scheduled.privacy_level,
                        status: scheduled.status,
                        entity_type: scheduled.entity_id,
                        entity_id: scheduled.entity_id,
                        entity_metadata: scheduled?.entity_metadata?.location,
                        image: scheduled.image,
                    });

                    if (scheduled?.creator?.id) {
                        userIds.push(scheduled.creator.id);
                        creators.push({
                            id: scheduled.creator.id,
                            username: scheduled.creator.username,
                            avatar: scheduled.creator.avatar,
                            discriminator: scheduled.creator.discriminator,
                        });
                    }
                }
                promise6 = this.guildScheduledRepository.cInsert({
                    transaction: queryRunner,
                    values: scheduledValues,
                });

                const uniqUserIds = uniq(userIds);
                const uniqByCreators = uniqBy(creators, 'id');

                const users = await this.userRepository.selectMany({
                    transaction: queryRunner,
                    select: {
                        sql: {
                            base: true,
                        },
                    },
                    where: {
                        IN: {
                            ids: uniqUserIds,
                        },
                    },
                });

                const usersValues = differenceBy(uniqByCreators, users, 'id');
                if (isNotEmpty(usersValues)) {
                    promise7 = this.userRepository.cInsert({
                        transaction: queryRunner,
                        values: usersValues,
                    });
                } else {
                    promise7 = this.userRepository.cBulkUpdate({
                        transaction: queryRunner,
                        values: uniqByCreators,
                        where: {
                            IN: {
                                ids: uniqUserIds,
                            },
                        },
                    });
                }
            }
            await promiseAllSettled([promise1, promise2, promise3, promise4, promise5, promise6, promise7]);

            await queryRunner.commitTransaction();

            return { id: discordGuild.id };
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
}
