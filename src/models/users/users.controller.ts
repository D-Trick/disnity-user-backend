// lib
import { Controller, Get, NotFoundException, Param, UseGuards } from '@nestjs/common';
// utils
import { controllerThrow } from '@utils/response/controller-throw';
// dtos
import { ParamGuildIdRequestDto } from '@common/dtos';
// guards
import { AuthGuardJwt } from '@guards/jwt-auth.guard';
import { AuthGuardUserMe } from '@guards/user-me.guard';
// helpers
import { UtilHelper } from './helper/util.helper';
// messages
import { SERVER_ERROR_MESSAGES } from '@common/messages';
// decorators
import { AuthUser } from '@decorators/auth-user.decorator';
// dtos
import { AuthUserDto } from '@models/auth/dtos/auth-user.dto';
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
    @UseGuards(AuthGuardUserMe)
    async me(@AuthUser() aUser: AuthUserDto) {
        try {
            const user = await this.usersServices.getUser(aUser.id);

            return user;
        } catch (error: any) {
            controllerThrow(error);
        }
    }

    @Get('/@me/guilds')
    @UseGuards(AuthGuardJwt)
    async meGuilds(@AuthUser() user: AuthUserDto) {
        try {
            const adminGuilds = await this.usersServices.getAdminGuilds(user.id);

            return adminGuilds;
        } catch (error: any) {
            controllerThrow(error);
        }
    }

    @Get('/@me/guilds/refresh')
    @UseGuards(AuthGuardJwt)
    async meGuildsRefresh(@AuthUser() user: AuthUserDto) {
        try {
            const refreshGuilds = await this.usersServices.refreshAdminGuilds(user.id);

            return refreshGuilds;
        } catch (error: any) {
            controllerThrow(error);
        }
    }

    @Get('/@me/guilds/:guildId')
    @UseGuards(AuthGuardJwt)
    async meGuildsGuildId(@AuthUser() user: AuthUserDto, @Param() param: ParamGuildIdRequestDto) {
        try {
            const { guildId } = param;

            const adminGuilds = await this.usersServices.getAdminGuilds(user.id);
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
    @UseGuards(AuthGuardJwt)
    async meGuildsGuildIdChannels(@AuthUser() user: AuthUserDto, @Param() param: ParamGuildIdRequestDto) {
        try {
            const { guildId } = param;

            const channels = await this.usersServices.getChannels(guildId, user.id, false);

            return channels;
        } catch (error: any) {
            controllerThrow(error);
        }
    }

    @Get('/@me/guilds/:guildId/channels/refresh')
    @UseGuards(AuthGuardJwt)
    async meGuildsGuildIdChannelsRefresh(@AuthUser() user: AuthUserDto, @Param() param: ParamGuildIdRequestDto) {
        try {
            const { guildId } = param;

            const channels = await this.usersServices.getChannels(guildId, user.id, true);

            return channels;
        } catch (error: any) {
            controllerThrow(error);
        }
    }
}
