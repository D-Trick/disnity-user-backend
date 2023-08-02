// types
import type { ServerPagination } from '@models/servers/ts/interfaces/pagination.interface';
import type { FindDetail } from '@databases/ts/interfaces/guild.interface';
// lib
import { Controller, Get, Request, UseGuards, Query, Param } from '@nestjs/common';
// guards
import { JwtAuthGuard } from '@guards/jwt-auth.guard';
// dtos
import { QuerysDto } from './dtos/routers';
import { ParamIdStringDto } from '@common/dtos';
// services
import { ServersService } from '@models/servers/servers.service';

// ----------------------------------------------------------------------

@Controller()
export class MypageController {
    constructor(private readonly serversService: ServersService) {}

    @Get('servers')
    @UseGuards(JwtAuthGuard)
    async index(@Request() req, @Query() query: QuerysDto): Promise<ServerPagination> {
        const user = req.user;

        const myServers = await this.serversService.adminServerList(user.id, query);

        return myServers;
    }

    @Get('servers/:id')
    @UseGuards(JwtAuthGuard)
    async detail(@Request() req, @Param() param: ParamIdStringDto): Promise<FindDetail> {
        const { id } = param;

        const user = req.user;

        const myServer = await this.serversService.adminServerDetail(id, user.id);

        return myServer;
    }
}
