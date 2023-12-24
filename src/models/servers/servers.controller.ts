// types
import type { ExpressRequest } from '@common/types/express.type';
// @nestjs
import { Controller, Get, Post, UseGuards, Request, Param, Body, Patch, Query, Delete } from '@nestjs/common';
// utils
import { controllerThrow } from '@utils/response/controller-throw';
// guards
import { JwtAuthGuard } from '@guards/jwt-auth.guard';
import { LoginCheckGuard } from '@guards/login-check.guard';
// dtos
import { QueryStringDto, ParamIdNumberDto, ParamIdStringDto, ParamNameDto, ParamGuildIdDto } from '@common/dtos';
import { CreateDto, UpdateDto } from './dtos/routers';
// services
import { ServersService } from '@models/servers/servers.service';

// ----------------------------------------------------------------------

@Controller()
export class ServersController {
    /**************************************************
     * Constructor
     **************************************************/
    constructor(private readonly serversService: ServersService) {}

    /**************************************************
     * Public Methods
     **************************************************/
    @Get()
    async allServerList(@Query() query: QueryStringDto) {
        try {
            const allServers = await this.serversService.getAllServers(query);

            return allServers;
        } catch (error: any) {
            controllerThrow(error);
        }
    }

    @Get('category/:id')
    async categoryServerList(@Param() param: ParamIdNumberDto, @Query() query: QueryStringDto) {
        try {
            const categoryServers = await this.serversService.getCategoryServers(param.id, query);

            return categoryServers;
        } catch (error: any) {
            controllerThrow(error);
        }
    }

    @Get('tags/:name')
    async tagServerList(@Param() param: ParamNameDto, @Query() query: QueryStringDto) {
        try {
            const tagServers = await this.serversService.getTagServers(param.name, query);

            return tagServers;
        } catch (error: any) {
            controllerThrow(error);
        }
    }

    @UseGuards(JwtAuthGuard)
    @Get('refresh/:guildId')
    async refresh(@Request() req: ExpressRequest, @Param() param: ParamGuildIdDto) {
        try {
            const serverRefreshResult = await this.serversService.refresh(param.guildId, req.user?.id);

            return serverRefreshResult;
        } catch (error: any) {
            controllerThrow(error);
        }
    }

    @UseGuards(LoginCheckGuard)
    @Get(':id')
    async detail(@Request() req: ExpressRequest, @Param() param: ParamIdStringDto) {
        try {
            const server = await this.serversService.detail(param.id, req.user.id);

            return server;
        } catch (error: any) {
            controllerThrow(error);
        }
    }

    @UseGuards(JwtAuthGuard)
    @Post()
    async store(@Request() req: ExpressRequest, @Body() body: CreateDto) {
        try {
            const result = await this.serversService.store(req.user.id, body);

            return result;
        } catch (error: any) {
            controllerThrow(error);
        }
    }

    @UseGuards(JwtAuthGuard)
    @Patch(':id')
    async update(@Request() req: ExpressRequest, @Param() param: ParamIdStringDto, @Body() body: UpdateDto) {
        try {
            const result = await this.serversService.edit(param.id, req.user.id, body);

            return result;
        } catch (error: any) {
            controllerThrow(error);
        }
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async delete(@Request() req: ExpressRequest, @Param() param: ParamIdStringDto) {
        try {
            const result = await this.serversService.delete(req.user.id, param.id);

            return result;
        } catch (error: any) {
            controllerThrow(error);
        }
    }
}
