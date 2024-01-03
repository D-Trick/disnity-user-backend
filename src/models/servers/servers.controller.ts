// @nestjs
import { Controller, Get, Post, UseGuards, Param, Body, Patch, Query, Delete } from '@nestjs/common';
// utils
import { controllerThrow } from '@utils/response/controller-throw';
// guards
import { AuthGuardJwt } from '@guards/jwt-auth.guard';
import { AuthGuardLoginCheck } from '@guards/login-check.guard';
// decorators
import { AuthUser } from '@decorators/auth-user.decorator';
// dtos
import {
    ParamIdNumberRequestDto,
    ParamIdStringRequestDto,
    ParamNameRequestDto,
    ParamGuildIdRequestDto,
} from '@common/dtos';
import { CreateRequestDto, UpdateRequestDto, ServerFilterRequestDto } from './dtos';
import { AuthUserDto } from '@models/auth/dtos/auth-user.dto';
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
    async allServerList(@Query() query: ServerFilterRequestDto) {
        try {
            const allServers = await this.serversService.getAllServers(query);

            return allServers;
        } catch (error: any) {
            controllerThrow(error);
        }
    }

    @Get('category/:id')
    async categoryServerList(@Param() param: ParamIdNumberRequestDto, @Query() query: ServerFilterRequestDto) {
        try {
            const categoryServers = await this.serversService.getCategoryServers(param.id, query);

            return categoryServers;
        } catch (error: any) {
            controllerThrow(error);
        }
    }

    @Get('tags/:name')
    async tagServerList(@Param() param: ParamNameRequestDto, @Query() query: ServerFilterRequestDto) {
        try {
            const tagServers = await this.serversService.getTagServers(param.name, query);

            return tagServers;
        } catch (error: any) {
            controllerThrow(error);
        }
    }

    @Get('refresh/:guildId')
    @UseGuards(AuthGuardJwt)
    async refresh(@AuthUser() user: AuthUserDto, @Param() param: ParamGuildIdRequestDto) {
        try {
            const serverRefreshResult = await this.serversService.refresh(param.guildId, user.id);

            return serverRefreshResult;
        } catch (error: any) {
            controllerThrow(error);
        }
    }

    @Get(':id')
    @UseGuards(AuthGuardLoginCheck)
    async detail(@AuthUser() user: AuthUserDto, @Param() param: ParamIdStringRequestDto) {
        try {
            const server = await this.serversService.detail(param.id, user.id);

            return server;
        } catch (error: any) {
            controllerThrow(error);
        }
    }

    @Post()
    @UseGuards(AuthGuardJwt)
    async store(@AuthUser() user: AuthUserDto, @Body() body: CreateRequestDto) {
        try {
            const result = await this.serversService.store(user.id, body);

            return result;
        } catch (error: any) {
            controllerThrow(error);
        }
    }

    @Patch(':id')
    @UseGuards(AuthGuardJwt)
    async update(
        @AuthUser() user: AuthUserDto,
        @Param() param: ParamIdStringRequestDto,
        @Body() body: UpdateRequestDto,
    ) {
        try {
            const result = await this.serversService.edit(param.id, user.id, body);

            return result;
        } catch (error: any) {
            controllerThrow(error);
        }
    }

    @Delete(':id')
    @UseGuards(AuthGuardJwt)
    async delete(@AuthUser() user: AuthUserDto, @Param() param: ParamIdStringRequestDto) {
        try {
            const result = await this.serversService.delete(user.id, param.id);

            return result;
        } catch (error: any) {
            controllerThrow(error);
        }
    }
}
