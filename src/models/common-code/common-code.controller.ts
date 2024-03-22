// @nestjs
import { Controller, Get, Param } from '@nestjs/common';
// utils
import { ControllerException } from '@utils/response';
// dtos
import { ParamCodeRequestDto } from '@common/dtos';
import { CommonCodeListResponseDto } from './dtos';
// services
import { CommonCodeListService } from './services/list.service';

// ----------------------------------------------------------------------

@Controller()
export class CommonCodeController {
    /**************************************************
     * Constructor
     **************************************************/
    constructor(private commonCodeListService: CommonCodeListService) {}

    /**************************************************
     * Public Methods
     **************************************************/
    @Get(':code')
    async commonCodeList(@Param() param: ParamCodeRequestDto) {
        try {
            const commonCodes = await this.commonCodeListService.getCommonCodes(param.code);

            return commonCodes.map((commonCode) => new CommonCodeListResponseDto(commonCode));
        } catch (error: any) {
            throw new ControllerException(error);
        }
    }
}
