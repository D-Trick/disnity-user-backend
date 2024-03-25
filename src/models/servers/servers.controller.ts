// @nestjs
import { Controller, Get, Post, UseGuards, Param, Body, Patch, Query, Delete } from '@nestjs/common';
// utils
import { ControllerException } from '@utils/response';
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
import {
    CreateRequestDto,
    UpdateRequestDto,
    ServerFilterRequestDto,
    CategoryServerListResponseDto,
    TagServerListResponseDto,
    ResultResponseDto,
    ServerResponseDto,
    SaveResultResponseDto,
} from './dtos';
import { AuthUserDto } from '@models/auth/dtos/auth-user.dto';
// services
import { ServersListService } from './services/list.service';
import { ServersStoreService } from './services/store.service';
import { ServersUpdateService } from './services/update.service';
import { ServersDeleteService } from './services/delete.service';
import { ServersDetailService } from './services/detail.service';

// ----------------------------------------------------------------------

@Controller()
export class ServersController {
    /**************************************************
     * Constructor
     **************************************************/
    constructor(
        private readonly serversListService: ServersListService,
        private readonly serversDetailService: ServersDetailService,
        private readonly serversStoreService: ServersStoreService,
        private readonly serversUpdateService: ServersUpdateService,
        private readonly serversDeleteService: ServersDeleteService,
    ) {}

    /**************************************************
     * Public Methods
     **************************************************/
    @Get()
    async allServerList(@Query() query: ServerFilterRequestDto) {
        try {
            const allServers = await this.serversListService.getAllServers(query);

            return new CategoryServerListResponseDto(allServers);
        } catch (error: any) {
            throw new ControllerException(error);
        }
    }

    @Get('category/:id')
    async categoryServerList(@Param() param: ParamIdNumberRequestDto, @Query() query: ServerFilterRequestDto) {
        try {
            const categoryServers = await this.serversListService.getCategoryServers(param.id, query);

            return new CategoryServerListResponseDto(categoryServers);
        } catch (error: any) {
            throw new ControllerException(error);
        }
    }

    @Get('tags/:name')
    async tagServerList(@Param() param: ParamNameRequestDto, @Query() query: ServerFilterRequestDto) {
        try {
            const tagServers = await this.serversListService.getTagServers(param.name, query);

            return new TagServerListResponseDto(tagServers);
        } catch (error: any) {
            throw new ControllerException(error);
        }
    }

    @Get('refresh/:guildId')
    @UseGuards(AuthGuardJwt)
    async refresh(@AuthUser() user: AuthUserDto, @Param() param: ParamGuildIdRequestDto) {
        try {
            const result = await this.serversUpdateService.refresh(param.guildId, user.id);

            return new ResultResponseDto(result);
        } catch (error: any) {
            throw new ControllerException(error);
        }
    }

    @Get(':id')
    @UseGuards(AuthGuardLoginCheck)
    async detail(@AuthUser() user: AuthUserDto, @Param() param: ParamIdStringRequestDto) {
        try {
            const server = await this.serversDetailService.server(param.id, user.id);

            return new ServerResponseDto(server);
        } catch (error: any) {
            throw new ControllerException(error);
        }
    }

    @Post()
    @UseGuards(AuthGuardJwt)
    async store(@AuthUser() user: AuthUserDto, @Body() body: CreateRequestDto) {
        try {
            const id = await this.serversStoreService.store(user.id, body);

            return new SaveResultResponseDto(id);
        } catch (error: any) {
            throw new ControllerException(error);
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
            const id = await this.serversUpdateService.edit(param.id, user.id, body);

            return new SaveResultResponseDto(id);
        } catch (error: any) {
            throw new ControllerException(error);
        }
    }

    @Delete(':id')
    @UseGuards(AuthGuardJwt)
    async delete(@AuthUser() user: AuthUserDto, @Param() param: ParamIdStringRequestDto) {
        try {
            const result = await this.serversDeleteService.delete(user.id, param.id);

            return new ResultResponseDto(result);
        } catch (error: any) {
            throw new ControllerException(error);
        }
    }
}
