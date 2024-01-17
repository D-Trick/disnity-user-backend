// @nestjs
import { Controller, Get, Param } from '@nestjs/common';
// dtos
import { ParamTypeRequestDto } from '@common/dtos';
// utils
import { controllerThrow } from '@utils/response/controller-throw';
// dtos
import { MenuListResponseDto } from './dtos';
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
    async menus(@Param() params: ParamTypeRequestDto) {
        try {
            const { type } = params;

            const menus = await this.menusService.getMenus(type, '디스코드 서버');

            return [new MenuListResponseDto(menus)];
        } catch (error: any) {
            controllerThrow(error);
        }
    }
}
