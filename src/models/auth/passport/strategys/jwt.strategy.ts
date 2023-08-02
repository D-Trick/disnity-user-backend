// @nestjs
import { ENV_CONFIG } from '@config/env.config';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
// lib
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

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

    validate(payload: any) {
        return {
            id: payload.id,
        };
    }
}
