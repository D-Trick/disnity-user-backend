// @nestjs
import { Controller, Get, Param } from '@nestjs/common';
// dtos
import { ParamCodeDto } from '@common/dtos';
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
    async commonCodeList(@Param() param: ParamCodeDto) {
        const { code } = param;

        const commonCodes = await this.commonCodeService.getCommonCodes(code);

        return commonCodes;
    }
}
