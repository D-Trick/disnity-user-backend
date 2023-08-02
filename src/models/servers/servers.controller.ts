// types
import type { Save } from './ts/interfaces/save.interface';
import type { ServerPagination } from './ts/interfaces/pagination.interface';
import type { IRequest } from '@common/ts/interfaces/express.interface';
// lib
import { Controller, Get, Post, UseGuards, Request, Param, Body, Patch, Query, Delete } from '@nestjs/common';
// guards
import { JwtAuthGuard } from '@guards/jwt-auth.guard';
import { LoginCheckGuard } from '@guards/login-check.guard';
// dtos
import { ParamIdNumberDto, ParamIdStringDto, ParamNameDto, ParamGuildIdDto } from '@common/dtos';
import { QuerysDto, CreateDto, UpdateDto } from './dtos/routers/';
// services
import { CacheService } from '@cache/redis/cache.service';
import { ServersService } from '@models/servers/servers.service';
import { UsersService } from '@models/users/users.service';

// ----------------------------------------------------------------------

@Controller()
export class ServersController {
    constructor(
        private readonly cacheService: CacheService,
        private readonly usersService: UsersService,
        private readonly serversService: ServersService,
    ) {}

    @Get()
    async index(@Query() query: QuerysDto): Promise<ServerPagination> {
        return this.serversService.allServerList(query);
    }

    @Get('category/:id')
    async indexCategory(@Param() param: ParamIdNumberDto, @Query() query: QuerysDto): Promise<ServerPagination> {
        const { id } = param;

        return this.serversService.categoryServerList(id, query);
    }

    @Get('tags/:name')
    async indexTags(@Param() param: ParamNameDto, @Query() query: QuerysDto): Promise<ServerPagination> {
        const { name } = param;

        return this.serversService.tagServerList(name, query);
    }

    @UseGuards(JwtAuthGuard)
    @Get('refresh/:guildId')
    async serverRefresh(@Request() req: IRequest, @Param() param: ParamGuildIdDto): Promise<{ result: boolean }> {
        const { guildId } = param;

        const user = await this.usersService.getUser(req.user?.id);
        const serverRefreshResult = await this.serversService.serverRefresh(guildId, user.id);

        return serverRefreshResult;
    }

    @UseGuards(LoginCheckGuard)
    @Get(':id')
    async detail(@Request() req: IRequest, @Param() param: ParamIdStringDto) {
        const { id } = param;

        const user = req.user;

        const server = await this.serversService.detail(id, user.id);

        return server;
    }

    @UseGuards(JwtAuthGuard)
    @Post()
    async store(@Request() req: IRequest, @Body() body: CreateDto): Promise<Save> {
        const userId = req.user?.id;

        const cacheUser = await this.cacheService.getUser(userId);
        const cacheAdmins = await this.cacheService.get(`disnity-bot-${body.id}-admins`);

        const result = await this.serversService.store(
            {
                id: cacheUser?.id,
                accessToken: cacheUser?.access_token,
            },
            cacheAdmins,
            body,
        );

        return result;
    }

    @UseGuards(JwtAuthGuard)
    @Patch(':id')
    async update(@Request() req: IRequest, @Param() param: ParamIdStringDto, @Body() body: UpdateDto): Promise<Save> {
        const { id } = param;
        const userId = req.user?.id;

        const cacheUser = await this.cacheService.getUser(userId);
        const user = await this.usersService.getUser(userId);

        const result = await this.serversService.edit(
            {
                id: user?.id,
                accessToken: cacheUser?.access_token,
            },
            {
                id,
                ...body,
            },
        );

        return result;
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async delete(@Request() req: IRequest, @Param() param: ParamIdStringDto): Promise<{ result: boolean }> {
        const { id } = param;

        return await this.serversService.delete(req.user.id, id);
    }
}
