// types
import type { JwtModuleOptions } from '@nestjs/jwt/dist/interfaces/jwt-module-options.interface';
// configs
import { ENV_CONFIG } from './env.config';

// ----------------------------------------------------------------------
export interface Token {
    secret: string;
    expiresIn: number;
}
// ----------------------------------------------------------------------

export const jwtConfig: JwtModuleOptions = {
    secret: ENV_CONFIG.JWT_SECRET,
};

export const accessTokenConfig: Token = {
    secret: ENV_CONFIG.JWT_SECRET,
    expiresIn: 60 * 10, // 10분
};

export const refreshTokenConfig: Token = {
    secret: ENV_CONFIG.JWT_SECRET,
    expiresIn: 60 * 60 * 24 * 1, // 1일
};

export const accessTokenTTL: number = 1000 * 60 * 10; // 10분
export const refreshTokenTTL: number = 1000 * 60 * 60 * 24 * 1; // 1일
