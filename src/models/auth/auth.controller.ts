// types
import type { Request as ExpressRequest, Response as ExpressResponse } from 'express';
// @nestjs
import { Controller, Get, Logger, Request, Response, UseGuards } from '@nestjs/common';
// lib
import dayjs from '@lib/dayjs';
import requestIp from 'request-ip';
// utils
import { ControllerException } from '@utils/response';
// configs
import { cookieOptions } from '@config/cookie.config';
import { DISCORD_CONFIG } from '@config/discord.config';
// guards
import { AuthGuardJwt } from '@guards/jwt-auth.guard';
import { AuthGuardDiscord } from '@guards/discord-auth.guard';
// decorators
import { AuthUser } from '@decorators/auth-user.decorator';
import { AuthDiscordUser } from '@decorators/auth-discord-user.decorator';
// dtos
import { AuthUserDto, AuthDiscordUserDto, TokenResponseDto, LoginCheckResponseDto } from './dtos';
// services
import { AuthTokenService } from '@models/auth/services/token.service';
import { UsersStoreService } from '@models/users/services/store.service';

// ----------------------------------------------------------------------

@Controller()
export class AuthController {
    private readonly logger = new Logger(AuthController.name);

    /**************************************************
     * Constructor
     **************************************************/
    constructor(
        private readonly authTokenService: AuthTokenService,
        private readonly usersStoreService: UsersStoreService,
    ) {}

    /**************************************************
     * Public Methods
     **************************************************/
    @Get('/login')
    login(@Response() res: ExpressResponse) {
        res.redirect(DISCORD_CONFIG.LOGIN_URL);
    }

    @Get('/login/callback')
    @UseGuards(AuthGuardDiscord)
    async loginCallback(
        @Request() req: ExpressRequest,
        @Response() res: ExpressResponse,
        @AuthDiscordUser() discordUser: AuthDiscordUserDto,
    ) {
        try {
            const accessToken = this.authTokenService.createJwt('access', discordUser.id);
            const refreshToken = this.authTokenService.createJwt('refresh', discordUser.id);
            const cookieExpires = dayjs().add(1, 'day').toDate();
            res.cookie('token', accessToken, cookieOptions(cookieExpires));
            res.cookie('refreshToken', refreshToken, cookieOptions(cookieExpires));

            await this.usersStoreService.loginUser(discordUser, requestIp.getClientIp(req));

            res.redirect('/login');
        } catch (error: any) {
            this.logger.error(error.message, error.stack);

            res.redirect('/auth/login');
        }
    }

    @Get('/logout')
    logout(@Response() res: ExpressResponse) {
        try {
            res.clearCookie('token', cookieOptions());
            res.clearCookie('refreshToken', cookieOptions());

            res.redirect('/logout');
        } catch (error: any) {
            this.logger.error(error.message, error.stack);

            res.redirect('/');
        }
    }

    @Get('/check')
    @UseGuards(AuthGuardJwt)
    check() {
        return new LoginCheckResponseDto(true);
    }

    @Get('/token/refresh')
    @UseGuards(AuthGuardJwt)
    async tokenRefresh(@AuthUser() user: AuthUserDto, @Response({ passthrough: true }) res: ExpressResponse) {
        try {
            const accessToken = this.authTokenService.createJwt('access', user.id);
            const refreshToken = this.authTokenService.createJwt('refresh', user.id);
            const cookieExpires = dayjs().add(1, 'day').toDate();
            res.cookie('token', accessToken, cookieOptions(cookieExpires));
            res.cookie('refreshToken', refreshToken, cookieOptions(cookieExpires));

            return new TokenResponseDto(accessToken, refreshToken);
        } catch (error: any) {
            throw new ControllerException(error);
        }
    }
}
