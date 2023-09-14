// types
import type { SqlOptions } from '@common/types/sql-options.type';
import type {
    SelectOptions,
    TotalMyGuildsCountOptions,
    TotalGuildAdminsCountOptions,
    TotalSearchGuildsCountOptions,
    TotalCategoryGuildsCountOptions,
    FindGuildsByIdsOptions,
    FindSearchGuildIdsOptions,
    FindGuildDetailByIdOptions,
    FindCategoryGuildIdsOptions,
    FindMyGuildIdsOptions,
    InsertOptions,
    UpdateOptions,
    BulkUpdateOptions,
    DeleteOptions,
    FindMyGuildDetailByIdOptions,
    FindGuildsByIdsSqlName,
    SelectSqlName,
} from '@databases/types/guild.type';
// lib
import { Repository } from 'typeorm';
// entities
import { Guild } from '@databases/entities/guild.entity';
// repositories
import { CustomRepository } from '@common/modules/typeorm-custom-repository.module';
// sql
import { selectMany, selectOne } from './sql/select';
import { totalCategoryGuildsCount } from './sql/total-category-guilds-count';
import { totalSearchGuildsCount } from './sql/total-search-guilds-count';
import { totalGuildAdminsCount } from './sql/total-admin-guilds-count';
import { findGuildDetailById } from './sql/find-guild-detail-by-id';
import { findSitemapUrls } from './sql/find-sitemap-urls';
import { findCategoryGuildIds } from './sql/pagination/find-category-guild-ids';
import { findSearchGuildIds } from './sql/pagination/find-search-guild-ids';
import { findGuildsByIds } from './sql/find-guilds-by-ids';
import { totalMyGuildsCount } from './sql/total-my-guilds-count';
import { findMyGuildIds } from './sql/pagination/find-my-guild-ids';
import { findMyGuildDetailById } from './sql/find-my-guild-detail-by-id';
import { cInsert } from './sql/insert';
import { cUpdate } from './sql/update';
import { cBulkUpdate } from './sql/bulk-update';
import { cDelete } from './sql/delete';

// ----------------------------------------------------------------------

@CustomRepository(Guild)
export class GuildRepository extends Repository<Guild> {
    /**
     * 총 카테고리 길드 수
     * @param {TotalCategoryGuildsCountOptions} options
     */
    async totalCategoryGuildsCount(options: TotalCategoryGuildsCountOptions) {
        return totalCategoryGuildsCount(this, options);
    }

    /**
     * 총 검색된 길드 수
     * @param {TotalSearchGuildsCountOptions} options
     */
    async totalSearchGuildsCount(options: TotalSearchGuildsCountOptions) {
        return totalSearchGuildsCount(this, options);
    }

    /**
     * 총 나의 길드 수
     * @param {TotalGuildAdminsCountOptions} options
     */
    async totalMyGuildsCount(options: TotalMyGuildsCountOptions) {
        return totalMyGuildsCount(this, options);
    }

    /**
     * 총 길드에 관리자 수
     * @param {TotalGuildAdminsCountOptions} options
     */
    async totalGuildAdminsCount(options: TotalGuildAdminsCountOptions) {
        return totalGuildAdminsCount(this, options);
    }

    /**
     * Select One
     * @param {SelectOptions} options
     */
    async selectOne<T extends SelectSqlName = 'columns'>(options: SelectOptions) {
        return selectOne<T>(this, options);
    }
    /**
     * Select Many
     * @param {SelectOptions} options
     */
    async selectMany<T extends SelectSqlName = 'columns'>(options: SelectOptions) {
        return selectMany<T>(this, options);
    }

    /**
     * 나의 길드 상세 조회
     * @param {FindGuildsByIdsOptions} options
     */
    async findMyGuildDetailById(options: FindMyGuildDetailByIdOptions) {
        return findMyGuildDetailById(this, options);
    }

    /**
     * 길드 상세 조회
     * @param {FindGuildDetailByIdOptions} options
     */
    async findGuildDetailById(options: FindGuildDetailByIdOptions) {
        return findGuildDetailById(this, options);
    }

    /**
     * 서버 목록 조회
     * @param {FindGuildsByIdsOptions} options
     */
    async findGuildsByIds<T extends FindGuildsByIdsSqlName>(options: FindGuildsByIdsOptions) {
        return findGuildsByIds<T>(this, options);
    }

    /**
     * category에 맞는 guild ids 가져오기
     * @param {FindCategoryGuildIdsOptions} options
     */
    async findCategoryGuildIds(options: FindCategoryGuildIdsOptions) {
        return findCategoryGuildIds(this, options);
    }

    /**
     * 나의 guild ids 가져오기
     * @param {FindMyGuildIdsOptions} options
     */
    async findMyGuildIds(options: FindMyGuildIdsOptions) {
        return findMyGuildIds(this, options);
    }

    /**
     * 검색에 일치하는 guild ids 가져오기
     * @param {FindSearchGuildIdsOptions} options
     * @returns ids
     */
    async findSearchGuildIds(options: FindSearchGuildIdsOptions) {
        return findSearchGuildIds(this, options);
    }

    /**
     * sitemap server url 가져오기
     * @param {SqlOptions} options
     */
    async findSitemapUrls(options?: SqlOptions) {
        return findSitemapUrls(this, options);
    }

    /**
     * Custom Insert
     * @param {InsertOptions} options
     */
    async cInsert(options: InsertOptions) {
        return cInsert(this, options);
    }

    /**
     * Custom Update
     * @param {UpdateOptions} options
     */
    async cUpdate(options: UpdateOptions) {
        return cUpdate(this, options);
    }

    /**
     * Custom Bulk Update
     * @param {BulkUpdateOptions} options
     */
    async bulkUpdate(options: BulkUpdateOptions) {
        return cBulkUpdate(this, options);
    }

    /**
     * Custom Delete
     * @param {DeleteOptions} options
     */
    async cDelete(options: DeleteOptions) {
        return cDelete(this, options);
    }
}
