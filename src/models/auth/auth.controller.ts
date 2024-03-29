// types
import type { Request as ExpressRequest, Response as ExpressResponse } from 'express';
// @nestjs
import { Controller, Get, Logger, Request, Response, UseGuards } from '@nestjs/common';
// lib
import requestIp from 'request-ip';
import dayjs from '@lib/dayjs';
// utils
import { ControllerException } from '@utils/response';
// configs
import { cookieOptions } from '@config/cookie.config';
// guards
import { AuthGuardJwt } from '@guards/jwt-auth.guard';
import { AuthGuardDiscord } from '@guards/discord-auth.guard';
// decorators
import { AuthUser } from '@decorators/auth-user.decorator';
import { AuthDiscordUser } from '@decorators/auth-discord-user.decorator';
// dtos
import { AuthUserDto, AuthDiscordUserDto, TokenResponseDto, LoginCheckResponseDto } from './dtos';
// services
import { AuthService } from '@models/auth/auth.service';
import { UsersService } from '@models/users/users.service';

// ----------------------------------------------------------------------

@Controller()
export class AuthController {
    private readonly logger = new Logger(AuthController.name);

    /**************************************************
     * Constructor
     **************************************************/
    constructor(
        private readonly authService: AuthService,
        private readonly usersService: UsersService,
    ) {}

    /**************************************************
     * Public Methods
     **************************************************/
    @Get('/login')
    @UseGuards(AuthGuardDiscord)
    login() {
        return 'Discord Login Redirect...';
    }

    @Get('/login/callback')
    @UseGuards(AuthGuardDiscord)
    async loginCallback(
        @Request() req: ExpressRequest,
        @Response() res: ExpressResponse,
        @AuthDiscordUser() discordUser: AuthDiscordUserDto,
    ) {
        try {
            const accessToken = this.authService.createJwtToken('access', discordUser.id);
            const refreshToken = this.authService.createJwtToken('refresh', discordUser.id);

            await this.usersService.saveLoginUser(discordUser, requestIp.getClientIp(req));

            const expires = dayjs().add(1, 'day').toDate();
            res.cookie('token', accessToken, cookieOptions(expires));
            res.cookie('refreshToken', refreshToken, cookieOptions(expires));

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
    check(): { result: boolean } {
        try {
            return new LoginCheckResponseDto(true);
        } catch (error: any) {
            throw new ControllerException(error);
        }
    }

    @Get('/token/refresh')
    @UseGuards(AuthGuardJwt)
    async tokenRefresh(@AuthUser() user: AuthUserDto, @Response({ passthrough: true }) res: ExpressResponse) {
        try {
            const expires = dayjs().add(1, 'day').toDate();
            const accessToken = this.authService.createJwtToken('access', user.id);
            const refreshToken = this.authService.createJwtToken('refresh', user.id);
            res.cookie('token', accessToken, cookieOptions(expires));
            res.cookie('refreshToken', refreshToken, cookieOptions(expires));

            return new TokenResponseDto(accessToken, refreshToken);
        } catch (error: any) {
            throw new ControllerException(error);
        }
    }
}
