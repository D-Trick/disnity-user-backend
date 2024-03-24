// types
import type { MenuTree } from '../helpers/format-menu-tree';
// @nestjs
import { Injectable } from '@nestjs/common';
// helpers
import { formatMenuTree } from '../helpers/format-menu-tree';
// services
import { CacheDataService } from '@cache/cache-data.service';
// repositories
import { MenuRepository } from '@databases/repositories/menu';

// ----------------------------------------------------------------------

@Injectable()
export class MenusListService {
    /**************************************************
     * Constructor
     **************************************************/
    constructor(
        private readonly cacheDataService: CacheDataService,

        private readonly menuRepository: MenuRepository,
    ) {}

    /**************************************************
     * Public Methods
     **************************************************/
    /**
     * 타입에 맞는 메뉴 트리 가져오기
     * @param {string} type
     * @param {string} subHeaderName
     */
    async getMenus(type: string, subHeaderName: string): Promise<MenuTree> {
        const cacheMenus = await this.cacheDataService.getMenusByType(type);

        const isEmpty = !cacheMenus;
        if (isEmpty) {
            const menus = await this.menuRepository.findByType({
                where: {
                    type,
                },
            });

            const menuTree = formatMenuTree(subHeaderName, menus);

            await this.cacheDataService.setMenus(type, menuTree);

            return menuTree;
        }

        return cacheMenus;
    }
}
