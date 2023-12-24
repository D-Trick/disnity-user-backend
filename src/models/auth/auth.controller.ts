// types
import type { ExpressRequest, ExpressResponse } from '@common/types/express.type';
import type { Token } from './types/auth.type';
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
import { JwtAuthGuard } from '@guards/jwt-auth.guard';
import { DiscordAuthGuard } from '@guards/discord-auth.guard';
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
    @UseGuards(DiscordAuthGuard)
    login(): string {
        return 'Discord Login Redirect...';
    }

    @Get('/login/callback')
    @UseGuards(DiscordAuthGuard)
    async loginCallback(@Request() req: ExpressRequest, @Response() res: ExpressResponse): Promise<void> {
        try {
            const user = req.user;

            if (user.loginRedirect || user.accessDenied) return res.redirect('/');

            const accessToken = this.authService.createJwtToken('access', user.id);
            const refreshToken = this.authService.createJwtToken('refresh', user.id);

            await this.usersService.saveLoginInfo({
                ...user,
                ip: requestIp.getClientIp(req),
            });

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
    logout(@Response() res: ExpressResponse): void {
        res.clearCookie('token', getCookieOptions());
        res.clearCookie('refreshToken', getCookieOptions());

        res.redirect('/logout');
    }

    @Get('/check')
    @UseGuards(JwtAuthGuard)
    check(): { result: boolean } {
        return { result: true };
    }

    @Get('/token/refresh')
    @UseGuards(JwtAuthGuard)
    async tokenRefresh(
        @Request() req: ExpressRequest,
        @Response({ passthrough: true }) res: ExpressResponse,
    ): Promise<Token> {
        try {
            const user = req.user;
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
