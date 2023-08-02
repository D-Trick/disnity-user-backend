// modules
import { Module } from '@nestjs/common';
// services
import { CacheService } from './cache.service';

// ----------------------------------------------------------------------

@Module({
    providers: [CacheService],
    exports: [CacheService],
})
export class CacheModule {}
