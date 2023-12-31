// types
import type { SqlOptions } from '@common/types/sql-options.type';
// entities
import { Menu } from '@databases/entities/menu.entity';

// ----------------------------------------------------------------------

/******************************
 * FindByType
 ******************************/
export interface FindByTypeOptions extends SqlOptions {
    where: {
        type: Menu['type'];
    };
}

export type Menus = Pick<
    Menu,
    'id' | 'parent_id' | 'name' | 'path' | 'icon' | 'caption' | 'disabled' | 'depth' | 'sort'
>;
export type FindByType = Menus;
