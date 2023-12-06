// @nestjs
import { Controller, Get, Query, Param } from '@nestjs/common';
// dtos
import { QueryStringDto, ParamKeywordDto } from '@common/dtos';
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
    async keyword(@Param() param: ParamKeywordDto, @Query() query: QueryStringDto) {
        const servers = await this.serversService.getSearchServers(param.keyword, query);

        return servers;
    }
}
