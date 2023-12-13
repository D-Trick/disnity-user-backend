// lib
import { Module } from '@nestjs/common';
// services
import { PaginateService } from './services/paginate.service';
import { ServersPaginationService } from './servers-pagination.service';

// ----------------------------------------------------------------------

@Module({
    providers: [ServersPaginationService, PaginateService],
    exports: [ServersPaginationService],
})
export class ServersPaginationModule {}
