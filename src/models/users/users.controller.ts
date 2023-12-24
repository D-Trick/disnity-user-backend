// types
import type { ExpressRequest } from '@common/types/express.type';
// lib
import { Controller, Get, NotFoundException, Param, Request, UseGuards } from '@nestjs/common';
// utils
import { controllerThrow } from '@utils/response/controller-throw';
// dtos
import { ParamGuildIdDto } from '@common/dtos';
// guards
import { JwtAuthGuard } from '@guards/jwt-auth.guard';
import { JwtAuth2Guard } from '@guards/jwt-auth2.guard';
// helpers
import { UtilHelper } from './helper/util.helper';
// messages
import { SERVER_ERROR_MESSAGES } from '@common/messages';
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
        try {
            const user = await this.usersServices.getUser(req.user.id);

            return user;
        } catch (error: any) {
            controllerThrow(error);
        }
    }

    @Get('/@me/guilds')
    @UseGuards(JwtAuthGuard)
    async meGuilds(@Request() req: ExpressRequest) {
        try {
            const adminGuilds = await this.usersServices.getAdminGuilds(req.user.id);

            return adminGuilds;
        } catch (error: any) {
            controllerThrow(error);
        }
    }

    @Get('/@me/guilds/refresh')
    @UseGuards(JwtAuthGuard)
    async meGuildsRefresh(@Request() req: ExpressRequest) {
        try {
            const refreshGuilds = await this.usersServices.refreshAdminGuilds(req.user.id);

            return refreshGuilds;
        } catch (error: any) {
            controllerThrow(error);
        }
    }

    @Get('/@me/guilds/:guildId')
    @UseGuards(JwtAuthGuard)
    async meGuildsGuildId(@Request() req: ExpressRequest, @Param() param: ParamGuildIdDto) {
        try {
            const { guildId } = param;

            const adminGuilds = await this.usersServices.getAdminGuilds(req.user.id);
            const adminGuild = this.utilHelper.getAdminGuild(guildId, adminGuilds);

            if (!adminGuild) {
                throw new NotFoundException(SERVER_ERROR_MESSAGES.SERVER_NOT_FOUND);
            }

            return adminGuild;
        } catch (error: any) {
            controllerThrow(error);
        }
    }

    @Get('/@me/guilds/:guildId/channels')
    @UseGuards(JwtAuthGuard)
    async meGuildsGuildIdChannels(@Request() req: ExpressRequest, @Param() param) {
        try {
            const { guildId } = param;

            const channels = await this.usersServices.getChannels(guildId, req.user.id, false);

            return channels;
        } catch (error: any) {
            controllerThrow(error);
        }
    }

    @Get('/@me/guilds/:guildId/channels/refresh')
    @UseGuards(JwtAuthGuard)
    async meGuildsGuildIdChannelsRefresh(@Request() req: ExpressRequest, @Param() param) {
        try {
            const { guildId } = param;

            const channels = await this.usersServices.getChannels(guildId, req.user.id, true);

            return channels;
        } catch (error: any) {
            controllerThrow(error);
        }
    }
}
