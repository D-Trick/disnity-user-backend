// lib
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
    async code(@Param() param: ParamCodeDto) {
        const { code } = param;

        const common = await this.commonCodeService.getCommonCode(code);

        return common;
    }
}
