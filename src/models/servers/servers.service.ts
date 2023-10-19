// types
import type { SelectFilter } from '@common/types/select-filter.type';
import type { ServerDetail } from './types/servers.type';
import type { Save, SaveValues } from './types/save.type';
// lib
import {
    Injectable,
    HttpException,
    HttpStatus,
    BadRequestException,
    NotFoundException,
    ForbiddenException,
    Logger,
} from '@nestjs/common';
import { DataSource } from 'typeorm';
import { ERROR_MESSAGES } from '@common/messages';
import dayjs from '@lib/dayjs';
import { isEmpty, isNotEmpty, differenceBy, uniq, uniqBy } from '@lib/lodash';
// utils
import { timePassed, generateSnowflakeId } from '@utils/index';
// helpers
import { PaginationHelper } from './helpers/pagination.helper';
// services
import { CacheService } from '@cache/redis/cache.service';
import { DiscordApiService } from '@models/discord-api/discordApi.service';
// repositories
import { TagRepository } from '@databases/repositories/tag';
import { UserRepository } from '@databases/repositories/user';
import { GuildRepository } from '@databases/repositories/guild';
import { EmojiRepository } from '@databases/repositories/emoji';
import { CommonCodeRepository } from '@databases/repositories/common-code';
import { GuildsScheduledRepository } from '@databases/repositories/guild-scheduled';
import { GuildAdminPermissionRepository } from '@databases/repositories/guild-admin-permission';

// ----------------------------------------------------------------------

@Injectable()
export class ServersService {
    private readonly logger = new Logger(ServersService.name);

    /**************************************************
     * Constructor
     **************************************************/
    constructor(
        private readonly dataSource: DataSource,

        private readonly paginationHelper: PaginationHelper,

        private readonly cacheService: CacheService,
        private readonly discordApiService: DiscordApiService,

        private readonly tagRepository: TagRepository,
        private readonly userRepository: UserRepository,
        private readonly emojiRepository: EmojiRepository,
        private readonly guildRepository: GuildRepository,
        private readonly commonCodeRepository: CommonCodeRepository,
        private readonly guildScheduledRepository: GuildsScheduledRepository,
        private readonly guildAdminPermissionRepository: GuildAdminPermissionRepository,
    ) {}

    /**************************************************
     * Public Methods
     **************************************************/
    /**
     * 서버 새로고침
     * @param {string} guildId
     * @param {string} userId
     */
    async serverRefresh(guildId: string, userId: string): Promise<{ result: boolean }> {
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

    /**
     * 서버 상세조회
     * @param {string} id
     * @param {string} userId
     * @returns 서버상세 정보
     */
    async detail(id: string, userId: string): Promise<ServerDetail> {
        let server = await this.guildRepository.findGuildDetailById({
            where: {
                id,
            },
        });

        if (isEmpty(server) && userId) {
            server = await this.guildRepository.findMyGuildDetailById({
                where: {
                    id,
                    user_id: userId,
                },
            });
        }

        if (isEmpty(server)) {
            throw new NotFoundException(ERROR_MESSAGES.E404);
        }

        const promise1 = this.emojiRepository.selectMany({
            select: {
                columns: {
                    id: true,
                    name: true,
                    animated: true,
                },
            },
            where: {
                guild_id: id,
                animated: 0,
            },
        });
        const promise2 = this.emojiRepository.selectMany({
            select: {
                columns: {
                    id: true,
                    name: true,
                    animated: true,
                },
            },
            where: {
                guild_id: id,
                animated: 1,
            },
        });
        const [emojis, animate_emojis] = await Promise.all([promise1, promise2]);

        return {
            ...server,
            emojis,
            animate_emojis,
        };
    }

    /**
     * [Mypage] 나의 서버 상세 정보 조회
     * @param {string} id
     * @param {string } userId
     */
    async myServerDetail(id: string, userId: string) {
        const server = await this.guildRepository.findMyGuildDetailById({
            where: {
                id,
                user_id: userId,
            },
        });

        if (isEmpty(server)) {
            throw new NotFoundException(ERROR_MESSAGES.E404);
        }

        return server;
    }

    /**
     * 전체 서버 목록 조회
     * @param {SelectFilter} filter
     */
    async allServerList(filter: SelectFilter) {
        const promise1 = this.commonCodeRepository.selectOne({
            select: {
                columns: {
                    name: true,
                },
            },
            where: {
                code: 'category',
                value: 'all',
            },
        });
        const promise2 = this.paginationHelper.paginate<'base'>({
            listType: 'category-server',
            filter,
        });
        const [category, servers] = await Promise.all([promise1, promise2]);

        return {
            ...servers,
            categoryName: category?.name,
        };
    }

    /**
     * 카테고리에 해당하는 서버 목록 조회
     * @param {number} categoryId
     * @param {Filter} filter
     */
    async categoryServerList(categoryId: number, filter: SelectFilter) {
        const promise1 = this.commonCodeRepository.selectOne({
            select: {
                columns: {
                    name: true,
                },
            },
            where: {
                code: 'category',
                value: String(categoryId),
            },
        });
        const promise2 = this.paginationHelper.paginate<'base'>({
            listType: 'category-server',
            categoryId,
            filter,
        });
        const [category, servers] = await Promise.all([promise1, promise2]);

        return {
            ...servers,
            categoryName: category?.name,
        };
    }

    /**
     * 검색(키워드)에 해당하는 서버 목록 조회
     * @param {string} keyword
     * @param {SelectFilter} filter
     */
    async searchServerList(keyword: string, filter: SelectFilter) {
        const servers = await this.paginationHelper.paginate<'base'>({
            listType: 'search-server',
            filter,
            keyword,
        });

        return {
            ...servers,
            keyword,
        };
    }

    /**
     * 태그명에 해당하는 서버 목록 조회
     * @param {string} tagName
     * @param {Filter} filter
     */
    async tagServerList(tagName: string, filter: SelectFilter) {
        const servers = await this.paginationHelper.paginate<'base'>({
            listType: 'tag-server',
            filter,
            tagName,
        });

        return {
            tagName,
            ...servers,
        };
    }

    /**
     * [Mypage] 나의 서버 목록 조회
     * @param {string} userId
     * @param {SelectFilter} filter
     */
    async myServerList(userId: string, filter: SelectFilter) {
        const servers = await this.paginationHelper.paginate<'myGuild'>({
            listType: 'my-server',
            userId,
            filter,
        });

        return servers;
    }

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

            if (linkType === 'invite') {
                if (inviteAuto === 'auto') {
                    const invites = await this.discordApiService.channels().createInvites(channelId);

                    newInviteCode = invites.code;
                }

                // 초대코드가 유효한지 검사
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
            const cacheAdmins = await this.cacheService.get(`disnity-bot-${id}-admins`);
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
                    promise6 = this.userRepository.cBulkUpdate({
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

            await Promise.all([promise1, promise2, promise3, promise4, promise5, promise6, promise7]);

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

        let promise1 = undefined;
        let promise2 = undefined;

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

            if (linkType === 'invite') {
                if (inviteAuto === 'auto') {
                    const invites = await this.discordApiService.channels().createInvites(channelId);

                    newInviteCode = invites.code;
                }

                // 초대코드가 유효한지 검사
                await this.discordApiService.invites().detail(newInviteCode);
            }

            await queryRunner.startTransaction();
            // 서버 수정
            promise1 = this.guildRepository.cUpdate({
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
                promise2 = this.tagRepository.cInsert({
                    transaction: queryRunner,
                    values: formatTags,
                });
            }

            await Promise.all([promise1, promise2]);

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
     * 서버 삭제
     * @param {string} userId
     * @param {string} serverId
     */
    async delete(userId: string, serverId: string): Promise<{ result: boolean }> {
        const queryRunner = this.dataSource.createQueryRunner();
        try {
            const user = await this.userRepository.selectOne({
                select: {
                    sql: {
                        base: true,
                    },
                },
                where: {
                    id: userId,
                },
            });

            const guild = await this.guildRepository.selectOne({
                select: {
                    columns: {
                        id: true,
                        is_admin_open: true,
                    },
                },
                where: {
                    id: serverId,
                    user_id: user.id,
                },
            });
            if (isEmpty(guild)) {
                throw new NotFoundException(ERROR_MESSAGES.SERVER_NOT_FOUND);
            }

            if (guild.is_admin_open === 0) {
                throw new ForbiddenException(ERROR_MESSAGES.E403);
            }

            await queryRunner.startTransaction();

            const serversDelete = await this.guildRepository.cDelete({
                transaction: queryRunner,
                where: {
                    id: serverId,
                    user_id: user.id,
                },
            });
            if (serversDelete.affected === 0) {
                throw new BadRequestException(ERROR_MESSAGES.DELETE_SERVER_NOT_FOUND);
            }

            const promise1 = this.tagRepository.cDelete({
                transaction: queryRunner,
                where: {
                    guild_id: serverId,
                },
            });

            const promise2 = this.emojiRepository.cDelete({
                transaction: queryRunner,
                where: {
                    guild_id: serverId,
                },
            });

            const promise3 = this.guildAdminPermissionRepository.cDelete({
                transaction: queryRunner,
                where: {
                    guild_id: serverId,
                },
            });

            const promise4 = this.guildScheduledRepository.cDelete({
                transaction: queryRunner,
                where: {
                    guild_id: serverId,
                },
            });
            await Promise.all([promise1, promise2, promise3, promise4]);

            await queryRunner.commitTransaction();

            return { result: true };
        } catch (error: any) {
            this.logger.error(error.message, error.stack);

            if (queryRunner.isTransactionActive) {
                await queryRunner.rollbackTransaction();
            }

            throw new HttpException(error.message, error.status || HttpStatus.BAD_REQUEST);
        } finally {
            await queryRunner.release();
        }
    }
}
