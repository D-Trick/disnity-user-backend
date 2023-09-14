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
    /**************************************************
     * Constructor
     **************************************************/
    constructor(private readonly serversService: ServersService) {}

    /**************************************************
     * Public Methods
     **************************************************/
    @Get(':keyword')
    async keyword(@Param() param: ParamKeywordDto, @Query() query: QuerysDto) {
        const servers = await this.serversService.searchServerList(param.keyword, query);

        return servers;
    }
}
