// types
import type { IRequest } from '@common/ts/interfaces/express.interface';
import type { AdminGuild } from './ts/interfaces/users.interface';
import type { Channel } from '@models/discord-api/ts/interfaces/discordApi.interface';
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
import { CacheService } from '@cache/redis/cache.service';
import { UsersService } from './users.service';
// entities
import { User } from '@databases/entities/user.entity';

// ----------------------------------------------------------------------

@Controller()
export class UsersController {
    constructor(
        private readonly utilHelper: UtilHelper,
        private readonly cacheService: CacheService,
        private readonly usersServices: UsersService,
    ) {}

    @Get('@me')
    @UseGuards(JwtAuth2Guard)
    async detail(@Request() req: IRequest): Promise<User | object> {
        const user = await this.cacheService.getUser(req.user.id);

        let newUser = undefined;
        if (user) {
            newUser = {
                id: user.id,
                global_name: user.global_name,
                username: user.username,
                discriminator: user.discriminator,
                email: user.email,
                verified: user.verified,
                avatar: user.avatar,
                locale: user.locale,
                created_at: user.created_at,
                updated_at: user.updated_at,
            };
        }

        return newUser || {};
    }

    @Get('/@me/guilds')
    @UseGuards(JwtAuthGuard)
    async index(@Request() req): Promise<AdminGuild[]> {
        const guilds = await this.usersServices.guilds(req.user.id);

        return guilds;
    }

    @Get('/@me/guilds/refresh')
    @UseGuards(JwtAuthGuard)
    async guildRefresh(@Request() req): Promise<AdminGuild[]> {
        const refreshGuilds = await this.usersServices.refreshGuilds(req.user.id);

        return refreshGuilds;
    }

    @Get('/@me/guilds/:guildId')
    @UseGuards(JwtAuthGuard)
    async show(@Request() req, @Param() param: ParamGuildIdDto): Promise<AdminGuild> {
        const { guildId } = param;

        const guilds = await this.usersServices.guilds(req.user.id);
        const guild = this.utilHelper.getGuildByGuildId(guildId, guilds);

        if (!guild) {
            throw new HttpException({ customMessage: '찾을 수 없는 서버입니다.' }, HttpStatus.NOT_FOUND);
        }

        return guild;
    }

    @Get('/@me/guilds/:guildId/channels')
    @UseGuards(JwtAuthGuard)
    async guildChannels(@Request() req, @Param() param): Promise<Channel[]> {
        const { guildId } = param;

        const channels = await this.usersServices.channels(guildId, req.user.id, false);

        return channels;
    }

    @Get('/@me/guilds/:guildId/channels/refresh')
    @UseGuards(JwtAuthGuard)
    async guildChannelsRefresh(@Request() req, @Param() param): Promise<Channel[]> {
        const { guildId } = param;

        const channels = await this.usersServices.channels(guildId, req.user.id, true);

        return channels;
    }
}
