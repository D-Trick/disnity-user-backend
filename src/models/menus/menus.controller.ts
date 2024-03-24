// @nestjs
import { Controller, Get, Param } from '@nestjs/common';
// dtos
import { ParamTypeRequestDto } from '@common/dtos';
// utils
import { ControllerException } from '@utils/response';
// dtos
import { MenuListResponseDto } from './dtos';
// services
import { MenusListService } from '@models/menus/services/list.service';

// ----------------------------------------------------------------------

@Controller()
export class MenusController {
    /**************************************************
     * Constructor
     **************************************************/
    constructor(private readonly menusListService: MenusListService) {}

    /**************************************************
     * Public Methods
     **************************************************/
    @Get(':type')
    async menus(@Param() params: ParamTypeRequestDto) {
        try {
            const { type } = params;

            const menus = await this.menusListService.getMenus(type, '디스코드 서버');

            return [new MenuListResponseDto(menus)];
        } catch (error: any) {
            throw new ControllerException(error);
        }
    }
}
