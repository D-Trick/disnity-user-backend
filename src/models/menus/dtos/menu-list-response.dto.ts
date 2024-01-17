// lib
import { Exclude, Expose } from 'class-transformer';
// entities
import { MenuTree } from '../helpers/format-menu-tree';

// ----------------------------------------------------------------------

export class MenuListResponseDto {
    @Exclude() private readonly _subHeader: MenuTree['subHeader'];
    @Exclude() private readonly _menus: MenuTree['menus'];

    constructor(menu: MenuTree) {
        this._subHeader = menu.subHeader;
        this._menus = menu.menus;
    }

    @Expose()
    get subHeader() {
        return this._subHeader;
    }

    @Expose()
    get menus() {
        return this._menus;
    }
}
