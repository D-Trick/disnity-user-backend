// @nestjs
import { Controller, Get, Query, Param } from '@nestjs/common';
// utils
import { controllerThrow } from '@utils/response/controller-throw';
// dtos
import { ParamKeywordRequestDto } from '@common/dtos';
import { ServerFilterRequestDto } from '@models/servers/dtos';
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
    async keyword(@Param() param: ParamKeywordRequestDto, @Query() query: ServerFilterRequestDto) {
        try {
            const servers = await this.serversService.getSearchServers(param.keyword, query);

            return servers;
        } catch (error: any) {
            controllerThrow(error);
        }
    }
}
