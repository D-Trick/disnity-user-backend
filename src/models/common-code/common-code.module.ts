// @nestjs
import { Module } from '@nestjs/common';
// controllers
import { CommonCodeController } from './common-code.controller';
// services
import { CommonCodeListService } from './services/list.service';
import { CommonCodeDetailService } from './services/detail.service';

// ----------------------------------------------------------------------

@Module({
    controllers: [CommonCodeController],
    providers: [CommonCodeListService, CommonCodeDetailService],
    exports: [CommonCodeListService, CommonCodeDetailService],
})
export class CommonCodeModule {}
