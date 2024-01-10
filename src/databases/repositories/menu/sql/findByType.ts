// types
import type { FindByType } from '@databases/types/menu.type';
import type { FindByTypeOptions } from '@databases/types/menu.type';
// lib
import { Repository } from 'typeorm';
// utils
import { connection } from '@utils/database';
// entities
import { Menu } from '@databases/entities/menu.entity';

// ----------------------------------------------------------------------

export async function findByType(repository: Repository<Menu>, options: FindByTypeOptions): Promise<FindByType[]> {
    const { transaction, where } = options || {};
    const { type } = where || {};

    const qb = connection<Menu>({
        repository,
        transaction,
    });

    return qb.query(
        `
        WITH RECURSIVE MenuCTE AS (
            SELECT
                id, 
                parent_id,
                name, 
                path, 
                icon, 
                caption, 
                disabled, 
                depth, 
                sort,
                CAST(concat(sort, name) AS CHAR(300)) AS tree_sort
            FROM menu
            WHERE
                parent_id IS NULL
                AND depth = 1
                AND type = ?

            UNION ALL

            SELECT
                menu.id, 
                menu.parent_id,
                menu.name, 
                menu.path, 
                menu.icon, 
                menu.caption, 
                menu.disabled, 
                menu.depth, 
                menu.sort,        
                concat(MenuCTE.tree_sort, menu.depth, menu.sort, menu.name) AS tree_sort
            FROM MenuCTE
            JOIN
                menu ON MenuCTE.id = menu.parent_id
        )
        SELECT
            id, 
            parent_id,
            name, 
            path, 
            icon, 
            caption, 
            disabled, 
            depth, 
            sort
        FROM
            MenuCTE
        ORDER BY tree_sort
    `,
        [type],
    );
}
