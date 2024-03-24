// lib
import { Module } from '@nestjs/common';
// services
import { ServersPaginationService } from './services/servers-pagination.service';

// ----------------------------------------------------------------------

@Module({
    providers: [ServersPaginationService],
    exports: [ServersPaginationService],
})
export class PaginationModule {}
