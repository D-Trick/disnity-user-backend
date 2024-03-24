// @nestjs
import { Module } from '@nestjs/common';
// modules
import { CacheModule } from '@cache/cache.module';
// controllers
import { MenusController } from './menus.controller';
// services
import { MenusListService } from './services/list.service';

// ----------------------------------------------------------------------

@Module({
    imports: [CacheModule],
    controllers: [MenusController],
    providers: [MenusListService],
    exports: [MenusListService],
})
export class MenusModule {}
