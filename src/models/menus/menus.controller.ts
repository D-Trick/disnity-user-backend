// types
import type { MenuTree } from '@lib/utiles';
// lib
import { Controller, Get, Param } from '@nestjs/common';
import { MenusService } from '@models/menus/menus.service';
// dtos
import { ParamTypeDto } from './dtos/routers';

// ----------------------------------------------------------------------

@Controller()
export class MenusController {
    constructor(private readonly menusService: MenusService) {}

    @Get(':type')
    async menuType(@Param() params: ParamTypeDto): Promise<MenuTree[]> {
        const { type }: ParamTypeDto = params;

        const menus = await this.menusService.getMenusByType(type);
        return menus;
    }
}
