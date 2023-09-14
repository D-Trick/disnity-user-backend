// types
import type { ExpressRequest } from '@common/types/express.type';
// lib
import { Controller, Get, HttpException, HttpStatus, Param, Request, UseGuards } from '@nestjs/common';
// dtos
import { ParamGuildIdDto } from '@common/dtos';
// guards
import { JwtAuthGuard } from '@guards/jwt-auth.guard';
import { JwtAuth2Guard } from '@guards/jwt-auth2.guard';
// helpers
import { UtilHelper } from './helper/util.helper';
// services
import { UsersService } from './users.service';

// ----------------------------------------------------------------------

@Controller()
export class UsersController {
    /**************************************************
     * Constructor
     **************************************************/
    constructor(
        private readonly utilHelper: UtilHelper,

        private readonly usersServices: UsersService,
    ) {}

    /**************************************************
     * Public Methods
     **************************************************/
    @Get('@me')
    @UseGuards(JwtAuth2Guard)
    async me(@Request() req: ExpressRequest) {
        const user = await this.usersServices.getUser(req.user.id);

        return user;
    }

    @Get('/@me/guilds')
    @UseGuards(JwtAuthGuard)
    async meGuilds(@Request() req: ExpressRequest) {
        const adminGuilds = await this.usersServices.getAdminGuilds(req.user.id);

        return adminGuilds;
    }

    @Get('/@me/guilds/refresh')
    @UseGuards(JwtAuthGuard)
    async meGuildsRefresh(@Request() req: ExpressRequest) {
        const refreshGuilds = await this.usersServices.refreshGuilds(req.user.id);

        return refreshGuilds;
    }

    @Get('/@me/guilds/:guildId')
    @UseGuards(JwtAuthGuard)
    async meGuildsGuildId(@Request() req: ExpressRequest, @Param() param: ParamGuildIdDto) {
        const { guildId } = param;

        const adminGuilds = await this.usersServices.getAdminGuilds(req.user.id);
        const adminGuild = this.utilHelper.getAdminGuild(guildId, adminGuilds);

        if (!adminGuild) {
            throw new HttpException({ customMessage: '찾을 수 없는 서버입니다.' }, HttpStatus.NOT_FOUND);
        }

        return adminGuild;
    }

    @Get('/@me/guilds/:guildId/channels')
    @UseGuards(JwtAuthGuard)
    async meGuildsGuildIdChannels(@Request() req: ExpressRequest, @Param() param) {
        const { guildId } = param;

        const channels = await this.usersServices.channels(guildId, req.user.id, false);

        return channels;
    }

    @Get('/@me/guilds/:guildId/channels/refresh')
    @UseGuards(JwtAuthGuard)
    async meGuildsGuildIdChannelsRefresh(@Request() req: ExpressRequest, @Param() param) {
        const { guildId } = param;

        const channels = await this.usersServices.channels(guildId, req.user.id, true);

        return channels;
    }
}
