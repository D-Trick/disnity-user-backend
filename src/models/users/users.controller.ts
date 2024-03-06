// lib
import { Controller, Get, NotFoundException, Param, UseGuards } from '@nestjs/common';
// utils
import { ControllerException } from '@utils/response';
// dtos
import { ParamGuildIdRequestDto } from '@common/dtos';
import { UserResponseDto, AdminGuildResponseDto, AdminGuildListResponseDto, ChannelListResponseDto } from './dtos';
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

            return new UserResponseDto(user);
        } catch (error: any) {
            throw new ControllerException(error);
        }
    }

    @Get('/@me/guilds')
    @UseGuards(AuthGuardJwt)
    async guildList(@AuthUser() user: AuthUserDto) {
        try {
            const adminGuilds = await this.usersServices.getAdminGuilds(user.id);

            return adminGuilds.map((adminGuild) => new AdminGuildListResponseDto(adminGuild));
        } catch (error: any) {
            throw new ControllerException(error);
        }
    }

    @Get('/@me/guilds/refresh')
    @UseGuards(AuthGuardJwt)
    async guildListRefresh(@AuthUser() user: AuthUserDto) {
        try {
            const adminGuilds = await this.usersServices.refreshAdminGuilds(user.id);

            return adminGuilds.map((adminGuild) => new AdminGuildListResponseDto(adminGuild));
        } catch (error: any) {
            throw new ControllerException(error);
        }
    }

    @Get('/@me/guilds/:guildId')
    @UseGuards(AuthGuardJwt)
    async guildDetail(@Param() param: ParamGuildIdRequestDto, @AuthUser() user: AuthUserDto) {
        try {
            const { guildId } = param;

            const adminGuilds = await this.usersServices.getAdminGuilds(user.id);
            const adminGuild = this.utilHelper.getAdminGuild(guildId, adminGuilds);

            if (!adminGuild) {
                throw new NotFoundException(SERVER_ERROR_MESSAGES.SERVER_NOT_FOUND);
            }

            return new AdminGuildResponseDto(adminGuild);
        } catch (error: any) {
            throw new ControllerException(error);
        }
    }

    @Get('/@me/guilds/:guildId/channels')
    @UseGuards(AuthGuardJwt)
    async channelList(@Param() param: ParamGuildIdRequestDto, @AuthUser() user: AuthUserDto) {
        try {
            const { guildId } = param;

            const channels = await this.usersServices.getChannels(guildId, user.id, false);

            return channels.map((channel) => new ChannelListResponseDto(channel));
        } catch (error: any) {
            throw new ControllerException(error);
        }
    }

    @Get('/@me/guilds/:guildId/channels/refresh')
    @UseGuards(AuthGuardJwt)
    async channelListRefresh(@Param() param: ParamGuildIdRequestDto, @AuthUser() user: AuthUserDto) {
        try {
            const { guildId } = param;

            const channels = await this.usersServices.getChannels(guildId, user.id, true);

            return channels.map((channel) => new ChannelListResponseDto(channel));
        } catch (error: any) {
            throw new ControllerException(error);
        }
    }
}
