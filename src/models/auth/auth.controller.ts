// types
import type { Response as IResponse } from '@common/ts/types/express.type';
import type { IRequest } from '@common/ts/interfaces/express.interface';
import type { Token } from './ts/interfaces';
// lib
import { Controller, Get, Request, Response, UseGuards } from '@nestjs/common';
import requestIp from 'request-ip';
import dayjs from '@lib/dayjs';
// configs
import { refreshTokenTTL } from '@config/jwt.config';
import { getCookieOptions } from '@config/cookie.config';
// guards
import { JwtAuthGuard } from '@guards/jwt-auth.guard';
import { DiscordAuthGuard } from '@guards/discord-auth.guard';
// services
import { AuthService } from '@models/auth/auth.service';
import { UsersService } from '@models/users/users.service';
import { CacheService } from '@cache/redis/cache.service';

// ----------------------------------------------------------------------

@Controller()
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly usersService: UsersService,
        private readonly cacheService: CacheService,
    ) {}

    @Get('/login')
    @UseGuards(DiscordAuthGuard)
    loginRedirect(): string {
        return 'Discord Login Redirect...';
    }

    @Get('/login/callback')
    @UseGuards(DiscordAuthGuard)
    async callback(@Request() req: IRequest, @Response() res: IResponse): Promise<void> {
        try {
            const user = req.user;

            if (user.loginRedirect || user.accessDenied) return res.redirect('/');

            const accessToken = this.authService.createJwtToken('access', user.id);
            const refreshToken = this.authService.createJwtToken('refresh', user.id);

            await this.usersService.infoSave({
                ...user,
                ip: requestIp.getClientIp(req),
            });

            const expires = dayjs().add(1, 'day').toDate();
            res.cookie('token', accessToken, getCookieOptions(expires));
            res.cookie('refreshToken', refreshToken, getCookieOptions(expires));

            res.redirect('/login');
        } catch {
            res.redirect('/auth/login');
        }
    }

    @Get('/logout')
    logout(@Response() res: IResponse): void {
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
    async refreshToken(@Request() req: IRequest, @Response({ passthrough: true }) res: IResponse): Promise<Token> {
        const user = req.user;

        const cacheUser = await this.cacheService.get(user.id);
        if (cacheUser) {
            await this.cacheService.set(user.id, cacheUser, refreshTokenTTL);
        }

        const expires = dayjs().add(1, 'day').toDate();
        const accessToken = this.authService.createJwtToken('access', user.id);
        const refreshToken = this.authService.createJwtToken('refresh', user.id);
        res.cookie('token', accessToken, getCookieOptions(expires));
        res.cookie('refreshToken', refreshToken, getCookieOptions(expires));
        return {
            accessToken,
            refreshToken,
        };
    }
}
