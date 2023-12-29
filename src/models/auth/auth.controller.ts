// types
import type { Request as ExpressRequest, Response as ExpressResponse } from 'express';
// @nestjs
import { Controller, Get, Logger, Request, Response, UseGuards } from '@nestjs/common';
// lib
import requestIp from 'request-ip';
import dayjs from '@lib/dayjs';
// utils
import { controllerThrow } from '@utils/response/controller-throw';
// configs
import { getCookieOptions } from '@config/cookie.config';
// guards
import { AuthGuardJwt } from '@guards/jwt-auth.guard';
import { AuthGuardDiscord } from '@guards/discord-auth.guard';
// decorators
import { AuthUser } from '@decorators/auth-user.decorator';
import { AuthDiscordUser } from '@decorators/auth-discord-user.decorator';
// dtos
import { AuthUserDto } from './dtos/auth-user.dto';
import { AuthDiscordUserDto } from './dtos/auth-discord-user.dto';
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
    login(): string {
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
            if (discordUser.isReLogin) {
                return res.redirect('/');
            }

            const accessToken = this.authService.createJwtToken('access', discordUser.id);
            const refreshToken = this.authService.createJwtToken('refresh', discordUser.id);

            await this.usersService.saveLoginInfo(discordUser, requestIp.getClientIp(req));

            const expires = dayjs().add(1, 'day').toDate();
            res.cookie('token', accessToken, getCookieOptions(expires));
            res.cookie('refreshToken', refreshToken, getCookieOptions(expires));

            res.redirect('/login');
        } catch (error: any) {
            this.logger.error(error.message, error.stack);

            res.redirect('/auth/login');
        }
    }

    @Get('/logout')
    logout(@Response() res: ExpressResponse) {
        res.clearCookie('token', getCookieOptions());
        res.clearCookie('refreshToken', getCookieOptions());

        res.redirect('/logout');
    }

    @Get('/check')
    @UseGuards(AuthGuardJwt)
    check(): { result: boolean } {
        return { result: true };
    }

    @Get('/token/refresh')
    @UseGuards(AuthGuardJwt)
    async tokenRefresh(@AuthUser() user: AuthUserDto, @Response({ passthrough: true }) res: ExpressResponse) {
        try {
            const expires = dayjs().add(1, 'day').toDate();
            const accessToken = this.authService.createJwtToken('access', user.id);
            const refreshToken = this.authService.createJwtToken('refresh', user.id);
            res.cookie('token', accessToken, getCookieOptions(expires));
            res.cookie('refreshToken', refreshToken, getCookieOptions(expires));

            return {
                accessToken,
                refreshToken,
            };
        } catch (error: any) {
            controllerThrow(error);
        }
    }
}
