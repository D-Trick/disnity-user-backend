// types
import type { FindByType } from '@databases/types/menu.type';
/**************************************************/
interface DynamicObject {
    [key: string]: any;
}
export interface MenuTree {
    subHeader: string;
    menus: (FindByType & {
        children: MenuTree['menus'];
    })[];
}
/**************************************************/
export function formatMenuTree(subHeaderName: string = '', menus: FindByType[] = []): MenuTree {
    const menuTree: MenuTree['menus'] = [];
    const menuIndexing: DynamicObject = {};

    menus.forEach((menu) => {
        menuIndexing[menu.id] = { ...menu, children: [] };
    });

    menus.forEach((menu: any) => {
        const currentMenu = menuIndexing[menu.id];
        const parentMenu = menuIndexing[currentMenu.parent_id];
        const isRootMenu = !parentMenu;

        if (parentMenu) {
            parentMenu.children.push(currentMenu);
        }

        if (isRootMenu) {
            menuTree.push(currentMenu);
        }
    });

    return { subHeader: subHeaderName, menus: menuTree };
}
