// types
import type { FindByType } from '@databases/types/menu.type';
import type { FindByTypeOptions } from '@databases/types/menu.type';
// lib
import { Repository } from 'typeorm';
// entities
import { Menu } from '@databases/entities/menu.entity';
// repositories
import { CustomRepository } from '@common/modules/typeorm-custom-repository.module';
// sql
import { findByType } from './sql/findByType';

// ----------------------------------------------------------------------

@CustomRepository(Menu)
export class MenuRepository extends Repository<Menu> {
    /**
     * 타입에 맞는 메튜 목록 조회
     * @param {FindByTypeOptions} options
     */
    async findByType(options: FindByTypeOptions): Promise<FindByType[]> {
        return findByType(this, options);
    }
}
