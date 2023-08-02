// types
import type { FindByType } from '@databases/ts/types/menu.type';
import type { FindByTypeOptions } from '@databases/ts/interfaces/menu.interface';
// lib
import { Repository } from 'typeorm';
import { createSelectQueryBuilder } from '@databases/utils/createQueryBuilder';
// entities
import { Menu } from '@databases/entities/menu.entity';
// repositories
import { CustomRepository } from '@common/modules/typeorm-custom-repository.module';

// ----------------------------------------------------------------------
const TABLE_ALIAS = 'menu';
// ----------------------------------------------------------------------

@CustomRepository(Menu)
export class MenuRepository extends Repository<Menu> {
    /**
     * 타입에 맞는 메뉴 목록 조회
     * @param {FindByTypeOptions} options
     */
    async findByType(options: FindByTypeOptions): Promise<FindByType[]> {
        const { transaction, where } = options || {};
        const { type } = where || {};

        const qb = createSelectQueryBuilder<Menu>(Menu, TABLE_ALIAS, {
            repository: this,
            transaction,
        });

        // SELECT
        qb.select([
            `${TABLE_ALIAS}.id         AS id`,
            `${TABLE_ALIAS}.name       AS name`,
            `${TABLE_ALIAS}.path       AS path`,
            `${TABLE_ALIAS}.depth      AS depth`,
        ]);

        // JOIN
        qb.innerJoin('menu', 'menu2', 'menu2.id = menu.parent_id');

        // WHERE
        qb.where(`${TABLE_ALIAS}.type = :type`, {
            type,
        });

        // ORDER BY
        qb.orderBy(`${TABLE_ALIAS}.sort`);

        return qb.getRawMany();
    }
}
