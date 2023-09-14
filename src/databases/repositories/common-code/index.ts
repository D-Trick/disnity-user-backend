// types
import type { SqlOptions } from '@common/types/sql-options.type';
import type { SelectOptions } from '@databases/types/common-code.type';
// lib
import { Repository } from 'typeorm';
// entities
import { CommonCode } from '@databases/entities/common-code.entity';
// repositories
import { CustomRepository } from '@common/modules/typeorm-custom-repository.module';
// sql
import { selectOne, selectMany } from './sql/select';
import { findCategorySitemapUrls } from './sql/find-category-sitemap-urls';

// ----------------------------------------------------------------------

@CustomRepository(CommonCode)
export class CommonCodeRepository extends Repository<CommonCode> {
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
     * FindByCode
     * @param {FindByCodeOptions} options
     */
    async findCategorySitemapUrls(options?: SqlOptions) {
        return findCategorySitemapUrls(this, options);
    }
}
