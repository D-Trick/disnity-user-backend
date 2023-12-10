// @nestjs
import { Controller, Get, Param } from '@nestjs/common';
// dtos
import { ParamTypeDto } from './dtos/routers';
// services
import { MenusService } from '@models/menus/menus.service';

// ----------------------------------------------------------------------

@Controller()
export class MenusController {
    /**************************************************
     * Constructor
     **************************************************/
    constructor(private readonly menusService: MenusService) {}

    /**************************************************
     * Public Methods
     **************************************************/
    @Get(':type')
    async menus(@Param() params: ParamTypeDto) {
        const { type } = params;

        const menus = await this.menusService.getMenus(type, '디스코드 서버');

        return [menus];
    }
}
