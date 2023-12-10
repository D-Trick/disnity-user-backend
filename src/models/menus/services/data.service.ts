// types
import type { MenuTree } from '../helpers/format-menu-tree';
// @nestjs
import { Injectable } from '@nestjs/common';
// helpers
import { formatMenuTree } from '../helpers/format-menu-tree';
// caches
import { CACHE_KEYS } from '@cache/redis/keys';
// services
import { CacheService } from '@cache/redis/cache.service';
// repositories
import { MenuRepository } from '@databases/repositories/menu';

// ----------------------------------------------------------------------

@Injectable()
export class MenusDataService {
    /**************************************************
     * Constructor
     **************************************************/
    constructor(
        private readonly cacheService: CacheService,
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
        const cacheMenus = await this.cacheService.getMenus(type);

        const isEmpty = !cacheMenus;
        if (isEmpty) {
            const menus = await this.menuRepository.findByType({
                where: {
                    type,
                },
            });

            const menuTree = formatMenuTree(subHeaderName, menus);

            const ttl1Day = 1000 * 60 * 60 * 24;
            await this.cacheService.set(CACHE_KEYS.MENUES(type), menuTree, ttl1Day);

            return menuTree;
        }

        return cacheMenus;
    }
}
