// @nestjs
import { Module } from '@nestjs/common';
// controllers
import { CommonCodeController } from './common-code.controller';
// services
import { CommonCodeService } from './common-code.service';
import { CommonCodeDataService } from './services/data.service';
import { CommonCodeDetailService } from './services/detail.service';

// ----------------------------------------------------------------------

@Module({
    controllers: [CommonCodeController],
    providers: [CommonCodeService, CommonCodeDataService, CommonCodeDetailService],
    exports: [CommonCodeService],
})
export class CommonCodeModule {}
