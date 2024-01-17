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

export type FindByType = {
    id: Menu['id'];
    parent_id: Menu['parent_id'];
    name: Menu['name'];
    path: Menu['path'];
    icon: Menu['icon'];
    caption: Menu['caption'];
    disabled: Menu['disabled'];
    depth: Menu['depth'];
    sort: Menu['sort'];
};
