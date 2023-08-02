// types
import type { ServerPagination } from '@models/servers/ts/interfaces/pagination.interface';
// lib
import { Controller, Get, Query, Param } from '@nestjs/common';
// dtos
import { QuerysDto } from './dtos/routers';
import { ParamKeywordDto } from '@common/dtos';
// services
import { ServersService } from '@models/servers/servers.service';

// ----------------------------------------------------------------------

@Controller()
export class SearchController {
    constructor(private readonly serversService: ServersService) {}

    @Get(':keyword')
    async index(@Param() param: ParamKeywordDto, @Query() query: QuerysDto): Promise<ServerPagination> {
        const { keyword } = param;

        const promise = this.serversService.searchServerList(keyword, query);
        return promise;
    }
}
