// types
import type { Save } from './types/save.type';
import type { ExpressRequest } from '@common/types/express.type';
// lib
import { Controller, Get, Post, UseGuards, Request, Param, Body, Patch, Query, Delete } from '@nestjs/common';
// guards
import { JwtAuthGuard } from '@guards/jwt-auth.guard';
import { LoginCheckGuard } from '@guards/login-check.guard';
// dtos
import { ParamIdNumberDto, ParamIdStringDto, ParamNameDto, ParamGuildIdDto } from '@common/dtos';
import { QuerysDto, CreateDto, UpdateDto } from './dtos/routers';
// services
import { CacheService } from '@cache/redis/cache.service';
import { ServersService } from '@models/servers/servers.service';
import { UsersService } from '@models/users/users.service';

// ----------------------------------------------------------------------

@Controller()
export class GuildsController {
    /**************************************************
     * Constructor
     **************************************************/
    constructor(
        private readonly cacheService: CacheService,
        private readonly usersService: UsersService,
        private readonly serversService: ServersService,
    ) {}

    /**************************************************
     * Public Methods
     **************************************************/
    @Get()
    async index(@Query() query: QuerysDto) {
        const allServers = await this.serversService.allServerList(query);

        return allServers;
    }

    @Get('category/:id')
    async categoryId(@Param() param: ParamIdNumberDto, @Query() query: QuerysDto) {
        const categoryServers = await this.serversService.categoryServerList(param.id, query);

        return categoryServers;
    }

    @Get('tags/:name')
    async tagsName(@Param() param: ParamNameDto, @Query() query: QuerysDto) {
        const tagServers = await this.serversService.tagServerList(param.name, query);

        return tagServers;
    }

    @UseGuards(JwtAuthGuard)
    @Get('refresh/:guildId')
    async refreshGuildId(
        @Request() req: ExpressRequest,
        @Param() param: ParamGuildIdDto,
    ): Promise<{ result: boolean }> {
        const serverRefreshResult = await this.serversService.serverRefresh(param.guildId, req.user?.id);

        return serverRefreshResult;
    }

    @UseGuards(LoginCheckGuard)
    @Get(':id')
    async id(@Request() req: ExpressRequest, @Param() param: ParamIdStringDto) {
        const server = await this.serversService.detail(param.id, req.user.id);

        return server;
    }

    @UseGuards(JwtAuthGuard)
    @Post()
    async store(@Request() req: ExpressRequest, @Body() body: CreateDto): Promise<Save> {
        const result = await this.serversService.store(req.user.id, body);

        return result;
    }

    @UseGuards(JwtAuthGuard)
    @Patch(':id')
    async update(
        @Request() req: ExpressRequest,
        @Param() param: ParamIdStringDto,
        @Body() body: UpdateDto,
    ): Promise<Save> {
        const result = await this.serversService.edit(param.id, req.user.id, body);

        return result;
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async delete(@Request() req: ExpressRequest, @Param() param: ParamIdStringDto): Promise<{ result: boolean }> {
        const result = await this.serversService.delete(req.user.id, param.id);

        return result;
    }
}
