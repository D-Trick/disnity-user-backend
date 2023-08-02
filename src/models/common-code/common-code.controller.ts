// types
import type { Select } from '@databases/ts/types/common-code.type';
// lib
import { Controller, Get, Param } from '@nestjs/common';
// dtos
import { ParamCodeDto } from '@common/dtos';
// services
import { CommonCodeService } from './common-code.service';

// ----------------------------------------------------------------------

@Controller()
export class CommonCodeController {
    constructor(private commonCodeService: CommonCodeService) {}

    @Get(':code')
    async findByCode(@Param() param: ParamCodeDto): Promise<Select[]> {
        const { code } = param;

        const common = await this.commonCodeService.getCodeByCommon(code);

        return common;
    }
}
