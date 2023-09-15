// @nestjs
import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
// modules
import { CacheModule } from '@cache/redis/cache.module';

// ----------------------------------------------------------------------
const modules: any = [HttpModule, CacheModule];
// ----------------------------------------------------------------------

@Module({
    imports: modules,
    exports: modules,
})
export class CoreModule {}
