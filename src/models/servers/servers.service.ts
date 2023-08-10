// types
import type { SelectFilter } from '@common/ts/interfaces/select-filter.interface';
import type { FindDetail, InsertOptions, UpdateOptions } from '@databases/ts/interfaces/guild.interface';
import type { ServerDetail } from './ts/interfaces/servers.interface';
import type { ServerPagination } from './ts/interfaces/pagination.interface';
import type { SaveUser, UpdateValues, InertValues, Save, Admins } from './ts/interfaces/save.interface';
// lib
import { Injectable, HttpException, HttpStatus, BadRequestException } from '@nestjs/common';
import { DataSource, InsertResult, UpdateResult } from 'typeorm';
import { ERROR_MESSAGES } from '@common/messages';
import dayjs from '@lib/dayjs';
import { timePassed } from '@lib/utiles/time-passed';
import { generateSnowflakeId } from '@lib/snowflake';
import { isEmpty, isNotEmpty, differenceBy, uniq, uniqBy } from '@lib/lodash';
// helpers
import { PaginationHelper } from './helpers/pagination.helper';

// services
import { DiscordApiService } from '@models/discord-api/discordApi.service';
// repositorys
import { TagRepository } from '@databases/repositories/tag.repository';
import { UserRepository } from '@databases/repositories/user.repository';
import { GuildRepository } from '@databases/repositories/guild.repository';
import { EmojiRepository } from '@databases/repositories/emoji.repository';
import { CommonCodeRepository } from '@databases/repositories/common-code.repository';
import { GuildsScheduledRepository } from '@databases/repositories/guilds-scheduled.repository';
import { ServerAdminPermissionRepository } from '@databases/repositories/server-admin-permission.repository';

// ----------------------------------------------------------------------

@Injectable()
export class ServersService {
    /**************************************************
     * Constructor
     **************************************************/
    constructor(
        private readonly dataSource: DataSource,

        private readonly paginationHelper: PaginationHelper,

        private readonly discordApiService: DiscordApiService,

        private readonly tagRepository: TagRepository,
        private readonly userRepository: UserRepository,
        private readonly emojiRepository: EmojiRepository,
        private readonly guildRepository: GuildRepository,
        private readonly commonCodeRepository: CommonCodeRepository,
        private readonly guildScheduledRepository: GuildsScheduledRepository,
        private readonly serverAdminPermissionRepository: ServerAdminPermissionRepository,
    ) {}

    /**************************************************
     * Public Methods
     **************************************************/
    /**
     * 서버갱신
     * @param {string} guildId
     * @param {string} userId
     */
    async serverRefresh(guildId: string, userId: string): Promise<{ result: boolean }> {
        try {
            const server = await this.guildRepository.selectOne({
                where: {
                    id: guildId,
                    user_id: userId,
                },
            });
            if (isEmpty(server)) {
                throw { status: 404, customMessage: ERROR_MESSAGES.SERVER_NOT_FOUND };
            }

            const minutes = 60 * 10;
            const { isTimePassed, currentDate, compareDate } = timePassed(
                server.server_refresh_date as string,
                minutes,
            );

            if (!isTimePassed) {
                const minutes = dayjs.duration(dayjs(compareDate).diff(currentDate)).minutes();
                const seconds = dayjs.duration(dayjs(compareDate).diff(currentDate)).seconds();

                const timeRemainning = minutes !== 0 ? `${minutes}분` : `${seconds}초`;
                throw { customMessage: `${timeRemainning} 후 다시 시도해주세요.` };
            }

            const guild = await this.discordApiService.guilds().detail(guildId);

            await this.guildRepository._update({
                values: {
                    name: guild.name,
                    banner: guild.banner || null,
                    splash: guild.splash || null,
                    icon: guild.icon || null,
                    member: guild.approximate_member_count,
                    online: guild.approximate_presence_count,
                    premium_tier: guild.premium_tier,
                    server_refresh_date: isTimePassed ? () => 'now()' : undefined,
                    is_bot: 1,
                },
                where: {
                    id: guildId,
                },
            });

            return { result: true };
        } catch (error: any) {
            if (error.status === 403) {
                await this.guildRepository._update({
                    values: {
                        is_bot: 0,
                    },
                    where: {
                        id: guildId,
                    },
                });

                throw new HttpException(error.customMessage || ERROR_MESSAGES.BOT_NOT_FOUND, HttpStatus.FORBIDDEN);
            } else {
                throw new HttpException(error.customMessage, error.status || HttpStatus.BAD_REQUEST);
            }
        }
    }

    /**
     * 서버 상세조회
     * @param {number} id
     * @param {string} userId
     * @returns 서버상세 정보
     */
    async detail(id: string, userId: string): Promise<ServerDetail> {
        const admin = await this.guildRepository.adminTotalCount({
            where: {
                id,
                user_id: userId,
            },
        });

        const server = await this.guildRepository.findDetail({
            where: {
                id,
                user_id: Number(admin.count) ? userId : undefined,
            },
        });
        if (isEmpty(server)) {
            throw new HttpException({ customMessage: ERROR_MESSAGES.E404 }, HttpStatus.NOT_FOUND);
        }

        const emojisPromise = this.emojiRepository.selectMany({
            where: {
                guild_id: id,
                animated: 0,
            },
        });
        const animateEmojisPromise = this.emojiRepository.selectMany({
            where: {
                guild_id: id,
                animated: 1,
            },
        });

        const [emojis, animate_emojis] = await Promise.all([emojisPromise, animateEmojisPromise]);

        return {
            ...server,
            emojis,
            animate_emojis,
        };
    }

    /**
     * 관리자 권한을 가진 유저의 서버 상세 정보 조회
     * @param id
     * @param userId
     */
    async adminServerDetail(id: string, userId: string): Promise<FindDetail> {
        const admin = await this.guildRepository.adminTotalCount({
            where: {
                id,
                user_id: userId,
            },
        });
        if (!Number(admin.count)) {
            throw new HttpException({ customMessage: ERROR_MESSAGES.E404 }, HttpStatus.NOT_FOUND);
        }

        const server = await this.guildRepository.findDetail({
            where: {
                id,
                user_id: userId,
            },
        });

        return server;
    }

    /**
     * 관리자 권한을 가진 유저의 서버 목록 조회
     * @param {string} userId
     * @param {Filter} filter
     */
    async adminServerList(userId: string, filter: SelectFilter): Promise<ServerPagination> {
        const servers = await this.paginationHelper.paginate({
            filter,
            userId,
        });

        return servers;
    }

    /**
     * 카테고리에 해당하는 서버목록 조회
     * @param {number} categoryId
     * @param {Filter} filter
     */
    async categoryServerList(categoryId: number, filter: SelectFilter): Promise<ServerPagination> {
        const categoryPromise = this.commonCodeRepository.selectOne({
            where: {
                code: 'category',
                value: categoryId,
            },
        });
        const serversPromise = this.paginationHelper.paginate({
            categoryId,
            filter,
        });

        const [category, servers] = await Promise.all([categoryPromise, serversPromise]);

        return {
            categoryName: category?.name,
            ...servers,
        };
    }

    /**
     * 검색(키워드)에 해당하는 서버목록 조회
     * @param {string} keyword
     * @param {Filter} filter
     */
    async searchServerList(keyword: string, filter: SelectFilter): Promise<ServerPagination> {
        const servers = await this.paginationHelper.paginate({
            listType: 'search',
            filter,
            keyword,
        });

        return {
            keyword,
            ...servers,
        };
    }

    /**
     * 태그명에 해당하는 서버목록 조회
     * @param {string} tagName
     * @param {Filter} filter
     */
    async tagServerList(tagName: string, filter: SelectFilter): Promise<ServerPagination> {
        const servers = await this.paginationHelper.paginate({
            listType: 'tag',
            filter,
            tagName,
        });

        return {
            tagName,
            ...servers,
        };
    }

    /**
     * 서버 전체목록 조회
     * @param {Filter} filter
     */
    async allServerList(filter: SelectFilter): Promise<ServerPagination> {
        const categoryPromise = this.commonCodeRepository.selectOne({
            where: {
                code: 'category',
                value: 'all',
            },
        });
        const serversPromise = this.paginationHelper.paginate({
            filter,
        });

        const [category, servers] = await Promise.all([categoryPromise, serversPromise]);

        return {
            categoryName: category.name,
            ...servers,
        };
    }

    /**
     * 서버 등록
     * @param {SaveUser} user 사용자정보
     * @param {Admins[]} admins 관리자 목록
     * @param {InsertValues} values 저장 값
     */
    async store(user: SaveUser, admins: Admins[], values: InertValues): Promise<Save> {
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
        } = values;

        let newInviteCode = inviteCode;

        let promise1 = undefined;
        let promise2 = undefined;
        let promise3 = undefined;
        let promise4 = undefined;
        let promise5 = undefined;
        let promise6 = undefined;
        let promise7 = undefined;
        let promise8 = undefined;

        const queryRunner = this.dataSource.createQueryRunner();
        try {
            const guild = await this.guildRepository.selectOne({
                where: {
                    id,
                },
            });
            if (isNotEmpty(guild)) throw { customMessage: ERROR_MESSAGES.SERVER_EXISTE };

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
            promise1 = this.guildRepository._insert({
                transaction: queryRunner,
                values: {
                    id: discordGuild.id,
                    user_id: user.id,
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
                    });
                }
                promise2 = this.tagRepository._insert({
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
                promise3 = this.emojiRepository._insert({
                    transaction: queryRunner,
                    values: formatEmojis,
                });
            }

            // 관리자 저장
            if (isNotEmpty(admins)) {
                const adminIds = [];
                const adminUsers = [];
                const adminPermissions = [];

                const adminsLength = admins.length;
                for (let i = 0; i < adminsLength; i++) {
                    const admin = admins[i];

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
                promise4 = this.serverAdminPermissionRepository._insert({
                    transaction: queryRunner,
                    values: adminPermissions,
                });

                // 관리자권한있는 사용자 저장
                const users = await this.userRepository.selectMany({
                    transaction: queryRunner,
                    where: {
                        IN: {
                            ids: adminIds,
                        },
                    },
                });

                const usersValues = differenceBy(adminUsers, users, 'id');

                if (isNotEmpty(usersValues)) {
                    promise5 = this.userRepository._insert({
                        transaction: queryRunner,
                        values: usersValues,
                    });
                } else {
                    promise6 = this.userRepository.bulkUpdate({
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
                promise6 = this.guildScheduledRepository._insert({
                    transaction: queryRunner,
                    values: scheduledValues,
                });

                const uniqUserIds = uniq(userIds);
                const uniqByCreators = uniqBy(creators, 'id');

                const users = await this.userRepository.selectMany({
                    transaction: queryRunner,
                    where: {
                        IN: {
                            ids: uniqUserIds,
                        },
                    },
                });

                const usersValues = differenceBy(uniqByCreators, users, 'id');
                if (isNotEmpty(usersValues)) {
                    promise7 = this.userRepository._insert({
                        transaction: queryRunner,
                        values: usersValues,
                    });
                } else {
                    promise8 = this.userRepository.bulkUpdate({
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

            await Promise.all([promise1, promise2, promise3, promise4, promise5, promise6, promise7, promise8]);

            await queryRunner.commitTransaction();

            return { id: discordGuild.id };
        } catch (error: any) {
            console.log(error);
            if (queryRunner.isTransactionActive) {
                await queryRunner.rollbackTransaction();
            }

            // DiscordApi 오류일 경우
            if (error.status) {
                throw new HttpException(error.customMessage, error.status);
            }

            // 기본 오류 처리
            throw new BadRequestException(error.customMessage || ERROR_MESSAGES.E400);
        } finally {
            await queryRunner.release();
        }
    }

    /**
     * 서버 수정
     * @param user 사용자정보
     * @param values 저장 값
     */
    async edit(user: SaveUser, values: UpdateValues): Promise<Save> {
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
        } = values;

        let newInviteCode = inviteCode;

        let promise1 = undefined;
        let promise2 = undefined;

        const queryRunner = this.dataSource.createQueryRunner();
        try {
            const server = await this.guildRepository.selectOne({
                where: {
                    id,
                    user_id: user.id,
                },
            });
            if (!server) throw { customMessage: ERROR_MESSAGES.SERVER_NOT_FOUND_OR_NOT_PERMISSION };

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
            promise1 = this.guildRepository._update({
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
                    id,
                },
            });

            // 이전 태그 삭제 후 현재 태그 추가
            await this.tagRepository._delete({
                transaction: queryRunner,
                where: {
                    guild_id: id,
                },
            });

            const tagsLength = tags.length;
            if (tagsLength > 0) {
                const formatTags = [];

                for (let i = 0; i < tagsLength; i++) {
                    const tag = tags[i];

                    formatTags.push({
                        id: generateSnowflakeId(),
                        guild_id: id,
                        name: tag.name,
                    });
                }
                promise2 = this.tagRepository._insert({
                    transaction: queryRunner,
                    values: formatTags,
                });
            }

            await Promise.all([promise1, promise2]);

            await queryRunner.commitTransaction();

            return { id };
        } catch (error: any) {
            if (queryRunner.isTransactionActive) {
                await queryRunner.rollbackTransaction();
            }

            // DiscordApi 오류일 경우
            if (error.status) {
                throw new HttpException(error.customMessage, error.status);
            }

            // 기본 오류 처리
            throw new BadRequestException(error.customMessage || ERROR_MESSAGES.E400);
        } finally {
            await queryRunner.release();
        }
    }

    /**
     * 서버 추가
     * @param options
     * @returns
     */
    async insert(options: InsertOptions): Promise<InsertResult> {
        return this.guildRepository._insert(options);
    }

    /**
     * 서버 업데이트
     * @param options
     * @returns
     */
    async update(options: UpdateOptions): Promise<UpdateResult> {
        return this.guildRepository._update(options);
    }

    /**
     * 서버 삭제
     * @param options
     * @returns
     */
    async delete(userId: string, serverId: string): Promise<{ result: boolean }> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.startTransaction();
        try {
            const user = await this.userRepository.selectOne({
                transaction: queryRunner,
                where: {
                    id: userId,
                },
            });

            const server = await this.guildRepository.selectOne({
                transaction: queryRunner,
                where: {
                    id: serverId,
                    wirter_id: user.id,
                },
            });

            if (isNotEmpty(server)) {
                if (server.is_admin_open === 0) {
                    throw { status: 403, customMessage: ERROR_MESSAGES.E403 };
                }

                const serversDelete = await this.guildRepository._delete({
                    transaction: queryRunner,
                    where: {
                        id: serverId,
                        user_id: user.id,
                    },
                });
                if (serversDelete.affected === 0) throw { customMessage: ERROR_MESSAGES.DELETE_SERVER_NOT_FOUND };

                const promise1 = this.tagRepository._delete({
                    transaction: queryRunner,
                    where: {
                        guild_id: serverId,
                    },
                });

                const promise2 = this.emojiRepository._delete({
                    transaction: queryRunner,
                    where: {
                        guild_id: serverId,
                    },
                });

                const promise3 = this.serverAdminPermissionRepository._delete({
                    transaction: queryRunner,
                    where: {
                        guild_id: server.id,
                    },
                });

                const promise4 = this.guildScheduledRepository._delete({
                    transaction: queryRunner,
                    where: {
                        guild_id: server.id,
                    },
                });

                await Promise.all([promise1, promise2, promise3, promise4]);

                await queryRunner.commitTransaction();

                return { result: true };
            } else {
                throw { status: 404, customMessage: ERROR_MESSAGES.SERVER_NOT_FOUND };
            }
        } catch (error: any) {
            if (queryRunner.isTransactionActive) {
                await queryRunner.rollbackTransaction();
            }

            throw new HttpException(
                { customMessage: error.customMessage || '' },
                error.status || HttpStatus.BAD_REQUEST,
            );
        } finally {
            await queryRunner.release();
        }
    }
}
