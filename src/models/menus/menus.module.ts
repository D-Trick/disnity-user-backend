// @nestjs
import { Module } from '@nestjs/common';
// controllers
import { MenusController } from './menus.controller';
// modules
import { CoreModule } from '@common/modules/core.module';
// services
import { MenusService } from './menus.service';
import { MenusDataService } from './services/data.service';

// ----------------------------------------------------------------------

@Module({
    imports: [CoreModule],
    controllers: [MenusController],
    providers: [MenusService, MenusDataService],
    exports: [MenusService],
})
export class MenusModule {}
