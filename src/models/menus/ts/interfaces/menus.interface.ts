// entities
import { Menu } from '@databases/entities/menu.entity';

// ----------------------------------------------------------------------

export interface MenuTree extends Menu {
    childrenMenus?: Menu[];
}
