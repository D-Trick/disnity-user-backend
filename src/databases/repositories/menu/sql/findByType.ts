// types
import type { FindByType } from '@databases/types/menu.type';
import type { FindByTypeOptions } from '@databases/types/menu.type';
// lib
import { Repository } from 'typeorm';
// utils
import { createSelectQueryBuilder } from '@databases/utils/createQueryBuilder';
// alias
import { MENU_TABLE_ALIAS as TABLE_ALIAS } from '@databases/common/table-alias';
// entities
import { Menu } from '@databases/entities/menu.entity';

// ----------------------------------------------------------------------

export async function findByType(repository: Repository<Menu>, options: FindByTypeOptions): Promise<FindByType[]> {
    const { transaction, where } = options || {};
    const { type } = where || {};

    const qb = createSelectQueryBuilder<Menu>(Menu, TABLE_ALIAS, {
        repository,
        transaction,
    });

    // SELECT
    qb.select([
        `${TABLE_ALIAS}.id         AS id`,
        `${TABLE_ALIAS}.name       AS name`,
        `${TABLE_ALIAS}.path       AS path`,
        `${TABLE_ALIAS}.icon       AS icon`,
        `${TABLE_ALIAS}.caption    AS caption`,
        `${TABLE_ALIAS}.disabled   AS disabled`,
        `${TABLE_ALIAS}.depth      AS depth`,
        `${TABLE_ALIAS}.sort       AS sort`,
    ]);

    // JOIN
    qb.innerJoin('menu', 'menu2', `menu2.id = ${TABLE_ALIAS}.parent_id`);

    // WHERE
    qb.where(`${TABLE_ALIAS}.type = :type`, {
        type,
    });

    // ORDER BY
    qb.orderBy(`${TABLE_ALIAS}.sort`);

    return qb.getRawMany();
}
