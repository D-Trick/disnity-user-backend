// types
import type { Menu } from '@databases/entities/menu.entity';
import type { FindByType } from '@databases/types/menu.type';
// lib
import isEmpty from 'lodash/isEmpty';
/**************************************************/
export interface MenuTree {
    subHeader: string;
    menus: Menu[];
}
/**************************************************/
export function menuTree(subHeaderName: string, menus: FindByType[]): MenuTree {
    let newMenus = [];

    const menusLength = menus.length;
    for (let i = 0; i < menusLength; i++) {
        const menu = menus[i];

        if (menu.depth === 1) {
            newMenus = newMenus.concat({
                ...menu,
                children: undefined,
            });
        } else {
            const parentIndex = newMenus.length - 1;
            if (isEmpty(newMenus[parentIndex].children)) {
                newMenus[parentIndex].children = [];
            }
            newMenus[parentIndex].children = newMenus[parentIndex].children.concat(menu);
        }
    }

    return {
        subHeader: subHeaderName || '',
        menus: newMenus,
    };
}
