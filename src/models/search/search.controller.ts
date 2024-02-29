// @nestjs
import { Controller, Get, Query, Param } from '@nestjs/common';
// utils
import { ControllerException } from '@utils/response';
// dtos
import { ParamKeywordRequestDto } from '@common/dtos';
import { ServerFilterRequestDto } from '@models/servers/dtos';
import { SearchServerListResponseDto } from './dtos';
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
    async server(@Param() param: ParamKeywordRequestDto, @Query() query: ServerFilterRequestDto) {
        try {
            const searchServer = await this.serversService.getSearchServers(param.keyword, query);

            return new SearchServerListResponseDto(searchServer);
        } catch (error: any) {
            throw new ControllerException(error);
        }
    }
}
