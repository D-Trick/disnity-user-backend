// lib
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
// configs
import { Token, accessTokenConfig, refreshTokenConfig } from '@config/jwt.config';

// ----------------------------------------------------------------------

@Injectable()
export class AuthService {
    constructor(private jwtService: JwtService) {}

    createJwtToken(type: string, userId: string): string {
        const tokenConfig: Token = type === 'access' ? accessTokenConfig : refreshTokenConfig;

        const payload: { id: string } = {
            id: userId,
        };

        const token = this.jwtService.sign(payload, tokenConfig);

        return token;
    }
}
