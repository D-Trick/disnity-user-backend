// @nestjs
import { Controller, Get, Request, UseGuards, Query, Param } from '@nestjs/common';
// utils
import { controllerThrow } from '@utils/response/controller-throw';
// guards
import { JwtAuthGuard } from '@guards/jwt-auth.guard';
// dtos
import { ParamIdStringDto, QueryStringDto } from '@common/dtos';
// services
import { ServersService } from '@models/servers/servers.service';

// ----------------------------------------------------------------------

@Controller()
export class MypageController {
    /**************************************************
     * Constructor
     **************************************************/
    constructor(private readonly serversService: ServersService) {}

    /**************************************************
     * Public Methods
     **************************************************/
    @Get('servers')
    @UseGuards(JwtAuthGuard)
    async servers(@Request() req, @Query() query: QueryStringDto) {
        try {
            const myServers = await this.serversService.getMyServers(req.user.id, query);

            return myServers;
        } catch (error: any) {
            controllerThrow(error);
        }
    }

    @Get('servers/:id')
    @UseGuards(JwtAuthGuard)
    async serversId(@Request() req, @Param() param: ParamIdStringDto) {
        try {
            const myServer = await this.serversService.myServerDetail(param.id, req.user.id);

            return myServer;
        } catch (error: any) {
            controllerThrow(error);
        }
    }
}
