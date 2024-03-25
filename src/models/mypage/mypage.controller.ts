// @nestjs
import { Controller, Get, UseGuards, Query, Param } from '@nestjs/common';
// utils
import { ControllerException } from '@utils/response';
// guards
import { AuthGuardJwt } from '@guards/jwt-auth.guard';
// docorators
import { AuthUser } from '@decorators/auth-user.decorator';
// dtos
import { AuthUserDto } from '@models/auth/dtos';
import { ParamIdStringRequestDto } from '@common/dtos';
import { ServerFilterRequestDto } from '@models/servers/dtos';
import { MyServerListResponseDto, MyServerResponseDto } from './dtos';
// services
import { ServersListService } from '@models/servers/services/list.service';
import { ServersDetailService } from '@models/servers/services/detail.service';

// ----------------------------------------------------------------------

@Controller()
export class MypageController {
    /**************************************************
     * Constructor
     **************************************************/
    constructor(
        private readonly serversListService: ServersListService,
        private readonly serversDetailService: ServersDetailService,
    ) {}

    /**************************************************
     * Public Methods
     **************************************************/
    @Get('servers')
    @UseGuards(AuthGuardJwt)
    async servers(@AuthUser() user: AuthUserDto, @Query() query: ServerFilterRequestDto) {
        try {
            const myServers = await this.serversListService.getMyServers(user.id, query);

            return new MyServerListResponseDto(myServers);
        } catch (error: any) {
            throw new ControllerException(error);
        }
    }

    @Get('servers/:id')
    @UseGuards(AuthGuardJwt)
    async serverDetail(@AuthUser() user: AuthUserDto, @Param() param: ParamIdStringRequestDto) {
        try {
            const myServer = await this.serversDetailService.myServer(param.id, user.id);

            return new MyServerResponseDto(myServer);
        } catch (error: any) {
            throw new ControllerException(error);
        }
    }
}
