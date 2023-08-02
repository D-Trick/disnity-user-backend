// lib
import { Module } from '@nestjs/common';
// modules
import { CoreModule } from '@common/modules/core.module';
// controllers
import { CommonCodeController } from './common-code.controller';
// services
import { CommonCodeService } from './common-code.service';

// ----------------------------------------------------------------------

@Module({
    imports: [CoreModule],
    controllers: [CommonCodeController],
    providers: [CommonCodeService],
    exports: [CommonCodeService],
})
export class CommonCodeModule {}
