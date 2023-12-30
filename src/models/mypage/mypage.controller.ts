// @nestjs
import { Controller, Get, UseGuards, Query, Param } from '@nestjs/common';
// utils
import { controllerThrow } from '@utils/response/controller-throw';
// guards
import { AuthGuardJwt } from '@guards/jwt-auth.guard';
// docorators
import { AuthUser } from '@decorators/auth-user.decorator';
// dtos
import { ParamIdStringRequestDto } from '@common/dtos';
import { ServerFilterRequestDto } from '@models/servers/dtos';
import { AuthUserDto } from '@models/auth/dtos/auth-user.dto';
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
    @UseGuards(AuthGuardJwt)
    async servers(@AuthUser() user: AuthUserDto, @Query() query: ServerFilterRequestDto) {
        try {
            const myServers = await this.serversService.getMyServers(user.id, query);

            return myServers;
        } catch (error: any) {
            controllerThrow(error);
        }
    }

    @Get('servers/:id')
    @UseGuards(AuthGuardJwt)
    async serversId(@AuthUser() user: AuthUserDto, @Param() param: ParamIdStringRequestDto) {
        try {
            const myServer = await this.serversService.myServerDetail(param.id, user.id);

            return myServer;
        } catch (error: any) {
            controllerThrow(error);
        }
    }
}
