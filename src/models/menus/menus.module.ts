// @nestjs
import { Module } from '@nestjs/common';
// modules
import { CacheModule } from '@cache/cache.module';
// controllers
import { MenusController } from './menus.controller';
// services
import { MenusService } from './menus.service';
import { MenusDataService } from './services/data.service';

// ----------------------------------------------------------------------

@Module({
    imports: [CacheModule],
    controllers: [MenusController],
    providers: [MenusService, MenusDataService],
    exports: [MenusService],
})
export class MenusModule {}
