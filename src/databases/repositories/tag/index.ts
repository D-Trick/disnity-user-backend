// types
import type { SqlOptions } from '@common/types/sql-options.type';
import type {
    CFindOptions,
    CFindOneOptions,
    FindTagGuildIdsOptions,
    TotalTagGuildsCountOptions,
    InsertOptions,
    UpdateOptions,
    DeleteOptions,
} from '@databases/types/tag.type';
// lib
import { Repository } from 'typeorm';
// entities
import { Tag } from '@databases/entities/tag.entity';
// repositories
import { CustomRepository } from '@common/modules/typeorm-custom-repository.module';
// sql
import { cFind } from './sql/find';
import { cFindOne } from './sql/find-one';
import { findSitemapData } from './sql/find-sitemap-data';
import { findTagGuildIds } from './sql/pagination/find-tag-guild-ids';
import { totalTagGuildsCount } from './sql/total-tag-guilds-count';
import { findAllTags } from './sql/find-all-tags';
import { cInsert } from './sql/insert';
import { cUpdate } from './sql/update';
import { cDelete } from './sql/delete';

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
     * Custom Find
     * @param {CFindOptions} options
     */
    async cFind(options: CFindOptions) {
        return cFind(this, options);
    }

    /**
     * Custom Find One
     * @param {CFindOneOptions} options
     */
    async cFindOne(options: CFindOneOptions) {
        return cFindOne(this, options);
    }

    /**
     * 전체태그(태그명 마다 총 개수) 목록을 가져온다.
     * @param {SqlOptions} options?
     */
    async findAllTags(options?: SqlOptions) {
        return findAllTags(this, options);
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
