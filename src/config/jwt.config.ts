// types
import type { JwtModuleOptions, JwtSignOptions } from '@nestjs/jwt/dist/interfaces/jwt-module-options.interface';
// configs
import { ENV_CONFIG } from './env.config';

// ----------------------------------------------------------------------

export const JWT_MODULE_CONFIG: JwtModuleOptions = {
    secret: ENV_CONFIG.JWT_SECRET,
} as const;

export const ACCESS_TOKEN_SIGN_CONFIG: JwtSignOptions = {
    secret: ENV_CONFIG.JWT_SECRET,
    expiresIn: 60 * 10, // 10분
} as const;

export const REFRESH_TOKEN_SIGN_CONFIG: JwtSignOptions = {
    secret: ENV_CONFIG.JWT_SECRET,
    expiresIn: 60 * 60 * 24 * 1, // 1일
} as const;

export const ACCESS_TOKEN_TTL: number = 1000 * 60 * 10; // 10분
export const REFRESH_TOKEN_TTL: number = 1000 * 60 * 60 * 24 * 1; // 1일
