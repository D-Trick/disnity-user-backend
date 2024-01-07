// @nestjs
import { Controller, Get, Param } from '@nestjs/common';
// utils
import { controllerThrow } from '@utils/response/controller-throw';
// dtos
import { ParamCodeRequestDto } from '@common/dtos';
// services
import { CommonCodeService } from './common-code.service';

// ----------------------------------------------------------------------

@Controller()
export class CommonCodeController {
    /**************************************************
     * Constructor
     **************************************************/
    constructor(private commonCodeService: CommonCodeService) {}

    /**************************************************
     * Public Methods
     **************************************************/
    @Get(':code')
    async commonCodeList(@Param() param: ParamCodeRequestDto) {
        try {
            const commonCodes = await this.commonCodeService.getCommonCodes(param.code);

            return commonCodes;
        } catch (error: any) {
            controllerThrow(error);
        }
    }
}
