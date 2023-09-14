// types
import type { MenuTree } from '@utils/index';
// lib
import { Injectable } from '@nestjs/common';
// utils
import { menuTree } from '@utils/index';
// repositories
import { MenuRepository } from '@databases/repositories/menu';

// ----------------------------------------------------------------------

@Injectable()
export class MenusService {
    /**************************************************
     * Constructor
     **************************************************/
    constructor(private menuRepository: MenuRepository) {}

    /**************************************************
     * Public Methods
     **************************************************/
    /**
     * 타입에 맞는 메뉴 트리 가져오기
     * @param {string} type
     */
    async getTypeMenus(type: string): Promise<MenuTree[]> {
        const rowMenus = await this.menuRepository.findByType({
            where: {
                type,
            },
        });

        const menus = menuTree('', rowMenus);

        return [menus];
    }
}
