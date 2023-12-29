// types
import type { AuthUser } from '@models/auth/types/auth.type';
// @nestjs
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
// lib
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
// configs
import { ENV_CONFIG } from '@config/env.config';
// dtos
import { AuthUserDto } from '@models/auth/dtos/auth-user.dto';

// ----------------------------------------------------------------------
interface customJwtFromRequest {
    (req: Request): string | null;
}
// ----------------------------------------------------------------------
/**
 * 토큰 인증 처리
 */
function customJwtFromRequest(): customJwtFromRequest {
    return (req: Request): string => {
        const { token } = req.cookies;
        const headerToken = ExtractJwt.fromAuthHeaderWithScheme('bearer')(req);

        return headerToken || token;
    };
}
// ----------------------------------------------------------------------

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor() {
        super({
            jwtFromRequest: customJwtFromRequest(),
            ignoreExpiration: false,
            secretOrKey: ENV_CONFIG.JWT_SECRET,
        });
    }

    validate(payload: any): AuthUserDto {
        const user: AuthUser = {
            id: payload.id,
            isLogin: true,
        };

        return AuthUserDto.create(user);
    }
}
