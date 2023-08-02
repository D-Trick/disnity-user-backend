// lib
import { Module } from '@nestjs/common';
// controllers
import { MenusController } from './menus.controller';
// services
import { MenusService } from './menus.service';

// ----------------------------------------------------------------------

@Module({
    controllers: [MenusController],
    providers: [MenusService],
    exports: [MenusService],
})
export class MenusModule {}
