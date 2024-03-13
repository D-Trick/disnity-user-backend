// modules
import { Module } from '@nestjs/common';
// services
import { CacheService } from './cache.service';
import { CacheDataService } from './cache-data.service';

// ----------------------------------------------------------------------

@Module({
    providers: [CacheService, CacheDataService],
    exports: [CacheService, CacheDataService],
})
export class CacheModule {}
