// @nestjs
import { Module } from '@nestjs/common';
// controllers
import { RedirectController } from './redirect.controller';

// ----------------------------------------------------------------------

@Module({
    controllers: [RedirectController],
})
export class RedirectModule {}
