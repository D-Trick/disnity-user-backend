// lib
import { Controller, Get, Param } from '@nestjs/common';
import { MenusService } from '@models/menus/menus.service';
// dtos
import { ParamTypeDto } from './dtos/routers';

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
    async type(@Param() params: ParamTypeDto) {
        const { type } = params;

        const menus = await this.menusService.getTypeMenus(type);
        return menus;
    }
}
