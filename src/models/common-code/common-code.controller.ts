// @nestjs
import { Controller, Get, Param } from '@nestjs/common';
// utils
import { ControllerException } from '@utils/response';
// dtos
import { ParamCodeRequestDto } from '@common/dtos';
import { CommonCodeListResponseDto } from './dtos';
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

            return commonCodes.map((commonCode) => new CommonCodeListResponseDto(commonCode));
        } catch (error: any) {
            throw new ControllerException(error);
        }
    }
}
