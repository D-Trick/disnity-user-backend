// types
import type { SqlOptions } from '@common/types/sql-options.type';
import type { CFindOneOptions, CFindOptions } from '@databases/types/common-code.type';
// lib
import { Repository } from 'typeorm';
// entities
import { CommonCode } from '@databases/entities/common-code.entity';
// repositories
import { CustomRepository } from '@common/modules/typeorm-custom-repository.module';
// sql
import { cFind } from './sql/find';
import { cFindOne } from './sql/find-one';
import { findSitemapData } from './sql/find-sitemap-data';

// ----------------------------------------------------------------------

@CustomRepository(CommonCode)
export class CommonCodeRepository extends Repository<CommonCode> {
    /**
     * Custom Find
     * @param {CFindOptions} options
     */
    async cFind(options: CFindOptions) {
        return await cFind(this, options);
    }

    /**
     * Custom Find One
     * @param {CFindOneOptions} options
     */
    async cFindOne(options: CFindOneOptions) {
        return await cFindOne(this, options);
    }

    /**
     * 카테고리 목록 가져오기
     * @param {SqlOptions} options
     */
    async findSitemapData(options?: SqlOptions) {
        return await findSitemapData(this, options);
    }
}
