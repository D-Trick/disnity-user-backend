// types
import type { SqlOptions } from '@common/types/sql-options.type';
import type {
    FindTagGuildIdsOptions,
    TotalTagGuildsCountOptions,
    InsertOptions,
    UpdateOptions,
    DeleteOptions,
    SelectOptions,
} from '@databases/types/tag.type';
// lib
import { Repository } from 'typeorm';
// entities
import { Tag } from '@databases/entities/tag.entity';
// repositories
import { CustomRepository } from '@common/modules/typeorm-custom-repository.module';
// sql
import { findSitemapData } from './sql/find-sitemap-data';
import { findTagGuildIds } from './sql/pagination/find-tag-guild-ids';
import { totalTagGuildsCount } from './sql/total-tag-guilds-count';
import { findNames } from './sql/find-names';
import { cInsert } from './sql/insert';
import { cUpdate } from './sql/update';
import { cDelete } from './sql/delete';
import { selectMany, selectOne } from './sql/select';

// ----------------------------------------------------------------------

@CustomRepository(Tag)
export class TagRepository extends Repository<Tag> {
    /**
     * 총 태그명에 해당하는 길드 수
     * @param {TotalTagGuildsCountOptions} options
     */
    async totalTagGuildsCount(options: TotalTagGuildsCountOptions) {
        return totalTagGuildsCount(this, options);
    }

    /**
     * Select One
     * @param {SelectOptions} options
     */
    async selectOne(options: SelectOptions) {
        return selectOne(this, options);
    }
    /**
     * Select Many
     * @param {SelectOptions} options
     */
    async selectMany(options: SelectOptions) {
        return selectMany(this, options);
    }

    /**
     * 태그명(총 합계) 형태로 가져온다.
     * @param {SqlOptions} options?
     */
    async findNames(options?: SqlOptions) {
        return findNames(this, options);
    }

    /**
     * 태그명에 해당하는 guild ids 가져오기
     * @param {FindTagGuildIdsOptions} options
     */
    async findTagGuildIds(options: FindTagGuildIdsOptions) {
        return findTagGuildIds(this, options);
    }

    /**
     * sitemap guild tag url 가져오기
     * @param {SqlOptions} options
     */
    async findSitemapData(options?: SqlOptions) {
        return await findSitemapData(this, options);
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
     * Custom Ddelete
     * @param {DeleteOptions} options
     */
    async cDelete(options: DeleteOptions) {
        return cDelete(this, options);
    }
}
