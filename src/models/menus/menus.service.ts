// types
import type { MenuTree } from '@lib/utiles';
// lib
import { Injectable } from '@nestjs/common';
import { menuTree } from '@lib/utiles';
// repositories
import { MenuRepository } from '@databases/repositories/menu.repository';

// ----------------------------------------------------------------------

@Injectable()
export class MenusService {
    constructor(private menuRepository: MenuRepository) {}

    /**
     * 타입에 맞는 메뉴 트리 가져오기
     * @param {string} type
     */
    async getMenusByType(type: string): Promise<MenuTree[]> {
        const rowMenus = await this.menuRepository.findByType({
            where: {
                type,
            },
        });

        const menus = menuTree('', rowMenus);
        return [menus];
    }
}
