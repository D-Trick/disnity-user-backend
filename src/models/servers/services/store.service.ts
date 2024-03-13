// types
import type { CacheGuildAdmin } from '@cache/types';
import type { SaveValues } from '../types/save.type';
import type { Emoji, Guild, GuildScheduledEvent } from '@models/discord-api/types/discordApi.type';
// @nestjs
import { Injectable, BadRequestException } from '@nestjs/common';
// lodash
import uniq from 'lodash/uniq';
import uniqBy from 'lodash/uniqBy';
import isEmpty from 'lodash/isEmpty';
import differenceBy from 'lodash/differenceBy';
// lib
import { DataSource, In, QueryRunner } from 'typeorm';
import dayjs from '@lib/dayjs';
// utils
import { generateSnowflakeId, promiseAllSettled } from '@utils/index';
// messages
import { SERVER_ERROR_MESSAGES } from '@common/messages';
// services
import { CacheDataService } from '@cache/cache-data.service';
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
    /**************************************************
     * Constructor
     **************************************************/
    constructor(
        private readonly dataSource: DataSource,

        private readonly cacheDataService: CacheDataService,
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
    async store(userId: string, saveValues: SaveValues) {
        const { id, tags } = saveValues;

        let promise1 = undefined;
        let promise2 = undefined;
        let promise3 = undefined;
        let promise4 = undefined;
        let promise5 = undefined;
        let promise6 = undefined;
        let promise7 = undefined;

        const queryRunner = this.dataSource.createQueryRunner();
        try {
            const guild = await this.guildRepository.cFindOne({
                select: {
                    id: true,
                },
                where: {
                    id,
                },
            });
            if (!isEmpty(guild)) {
                throw new BadRequestException(SERVER_ERROR_MESSAGES.SERVER_EXISTE);
            }

            const discordGuild = await this.discordApiService.guilds().detail(id);

            await queryRunner.startTransaction();

            // 서버 저장
            promise1 = this.serverInsert(queryRunner, userId, discordGuild, saveValues);

            // 태그 목록 저장
            const { length: tagsLength } = tags;
            if (tagsLength > 0) {
                promise2 = this.tagsInsert(queryRunner, discordGuild.id, tags);
            }

            // 이모지 목록 저장
            const { length: emojisLength } = discordGuild.emojis;
            if (emojisLength > 0) {
                promise3 = this.emojisInsert(queryRunner, discordGuild.id, discordGuild.emojis);
            }

            // 관리자 권한 목록 저장 / 관리자 권한있는 유저 목록 저장 또는 수정
            const cacheAdmins = await this.cacheDataService.getGuildAdminsByGuildId(id);
            if (!isEmpty(cacheAdmins)) {
                promise4 = this.adminPermissionsInsert(queryRunner, discordGuild.id, cacheAdmins);
                promise5 = this.adminsInsertOrUpdate(queryRunner, cacheAdmins);
            }

            // 길드 이벤트(일정) 목록 저장 / 길드 이벤트 생성자 유저 목록 저장 또는 수정
            const guildSchedules = await this.discordApiService.guildScheduledEvents().scheduledEvents(discordGuild.id);
            if (!isEmpty(guildSchedules)) {
                promise6 = this.guildSchedulesInsert(queryRunner, guildSchedules);
                promise7 = this.creatorsInsertOrUpdate(queryRunner, guildSchedules);
            }
            await promiseAllSettled([promise1, promise2, promise3, promise4, promise5, promise6, promise7]);

            await queryRunner.commitTransaction();

            return discordGuild.id;
        } catch (error) {
            if (queryRunner.isTransactionActive) {
                await queryRunner.rollbackTransaction();
            }

            throw error;
        } finally {
            await queryRunner.release();
        }
    }

    /**************************************************
     * Public Methods
     **************************************************/
    /**
     * 서버 저장
     * @param {QueryRunner} transaction
     * @param {string} userId
     * @param {Guild} guild
     * @param {SaveValues} saveValues
     */
    private async serverInsert(transaction: QueryRunner, userId: string, guild: Guild, saveValues: SaveValues) {
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

        return this.guildRepository.cInsert({
            transaction,
            values: {
                id: guild.id,
                user_id: userId,
                category_id: categoryId,
                name: guild.name,
                summary,
                content,
                is_markdown: contentType === 'markdown',
                icon: guild.icon || null,
                banner: guild.banner || null,
                splash: guild.splash || null,
                online: guild.approximate_presence_count,
                member: guild.approximate_member_count,
                premium_tier: guild.premium_tier,
                link_type: linkType,
                invite_code: linkType === 'invite' ? newInviteCode : null,
                membership_url: linkType === 'membership' ? membershipUrl : null,
                is_open: serverOpen === 'public',
                is_bot: 1,
            },
        });
    }

    /**
     * 태그 목록 저장
     * @param {QueryRunner} transaction
     * @param {string} guildId
     * @param {SaveValues['tags']} tags
     */
    private async tagsInsert(transaction: QueryRunner, guildId: string, tags: SaveValues['tags']) {
        const tagList = [...tags];

        const insertValues = tagList.map((tag, index) => ({
            id: generateSnowflakeId(),
            guild_id: guildId,
            name: tag.name,
            sort: index,
        }));

        return this.tagRepository.cInsert({
            transaction,
            values: insertValues,
        });
    }

    /**
     * 이모지 목록 저장
     * @param {QueryRunner} transaction
     * @param {string} guildId
     * @param {Emoji[]} emojis
     */
    private async emojisInsert(transaction: QueryRunner, guildId: string, emojis: Emoji[]) {
        const emojiList = [...emojis];

        const insertValues = emojiList.map((emoji) => ({
            id: emoji.id,
            guild_id: guildId,
            name: emoji.name,
            animated: emoji.animated,
        }));

        return this.emojiRepository.cInsert({
            transaction,
            values: insertValues,
        });
    }

    /**
     * 총 관리자, 서버 관리자 권한 목록 저장
     * @param {QueryRunner} transaction
     * @param {string} guildId
     * @param {any[]} admins
     */
    private async adminPermissionsInsert(transaction: QueryRunner, guildId: string, admins: any[]) {
        const adminList = [...admins];

        const insertValues = adminList.map((admin) => ({
            id: generateSnowflakeId(),
            user_id: admin.id,
            guild_id: guildId,
            is_owner: admin.is_owner,
        }));

        return this.guildAdminPermissionRepository.cInsert({
            transaction,
            values: insertValues,
        });
    }
    /**
     * 총 관리자, 서버 관리자 권한있는 사용자 목록 저장 또는 수정
     * @param {QueryRunner} transaction
     * @param {any[]} admins
     */
    private async adminsInsertOrUpdate(transaction: QueryRunner, admins: CacheGuildAdmin[]) {
        const adminList = [...admins];

        const adminIds = [];
        const adminUsers = [];
        adminList.map((admin) => {
            adminIds.push(admin.id);

            adminUsers.push({
                id: admin.id,
                global_name: admin.globalName,
                username: admin.username,
                discriminator: admin.discriminator,
                avatar: admin.avatar,
            });
        });

        const users = await this.userRepository.cFind({
            transaction,
            where: {
                id: In(adminIds),
            },
        });

        const newAdmins = differenceBy(adminUsers, users, 'id');
        if (!isEmpty(newAdmins)) {
            return this.userRepository.cInsert({
                transaction,
                values: newAdmins,
            });
        } else {
            return this.userRepository.cBulkUpdate({
                transaction,
                values: adminUsers,
                where: {
                    IN: {
                        ids: adminIds,
                    },
                },
            });
        }
    }

    /**
     * 길드 이벤트(일정) 목록 저장
     * @param {QueryRunner} transaction
     * @param {GuildScheduledEvent[]} guildSchedules
     */
    private async guildSchedulesInsert(transaction: QueryRunner, guildSchedules: GuildScheduledEvent[]) {
        const guildScheduleList = [...guildSchedules];

        const insertValues = guildScheduleList.map((scheduled) => ({
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
            entity_type: scheduled.entity_type,
            entity_id: scheduled.entity_id,
            entity_metadata: scheduled?.entity_metadata?.location,
            image: scheduled.image,
        }));

        return this.guildScheduledRepository.cInsert({
            transaction,
            values: insertValues,
        });
    }

    /**
     * 길드 이벤트(일정) 생성자 유저 목록 저장 또는 수정
     * @param {QueryRunner} transaction
     * @param {GuildScheduledEvent[]} guildSchedules
     */
    private async creatorsInsertOrUpdate(transaction: QueryRunner, guildSchedules: GuildScheduledEvent[]) {
        const guildScheduleList = [...guildSchedules];

        const creators = [];
        const creatorsIds = [];
        guildScheduleList.map((scheduled) => {
            if (!!scheduled?.creator?.id) {
                creatorsIds.push(scheduled.creator.id);
                creators.push({
                    id: scheduled.creator.id,
                    username: scheduled.creator.username,
                    avatar: scheduled.creator.avatar,
                    discriminator: scheduled.creator.discriminator,
                });
            }
        });

        const uniqCreatorsIds = uniq(creatorsIds);
        const uniqByCreators = uniqBy(creators, 'id');
        const users = await this.userRepository.cFind({
            transaction,
            select: {
                id: true,
                global_name: true,
                username: true,
                discriminator: true,
                email: true,
                verified: true,
                avatar: true,
                locale: true,
                created_at: true,
                updated_at: true,
            },
            where: {
                id: In(uniqCreatorsIds),
            },
        });

        const newCreators = differenceBy(uniqByCreators, users, 'id');
        if (!isEmpty(newCreators)) {
            return this.userRepository.cInsert({
                transaction,
                values: newCreators,
            });
        } else {
            return this.userRepository.cBulkUpdate({
                transaction,
                values: uniqByCreators,
                where: {
                    IN: {
                        ids: uniqCreatorsIds,
                    },
                },
            });
        }
    }
}
