// @nestjs
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
// configs
import { Token, accessTokenConfig, refreshTokenConfig } from '@config/jwt.config';

// ----------------------------------------------------------------------

@Injectable()
export class AuthTokenService {
    /**************************************************
     * Constructor
     **************************************************/
    constructor(private jwtService: JwtService) {}

    /**************************************************
     * Public Methods
     **************************************************/
    /**
     * JWT Token 생성
     * @param {'access' | 'refresh'} type
     * @param {string} userId
     */
    createJwtToken(type: 'access' | 'refresh', userId: string): string {
        const payload: { id: string } = {
            id: userId,
        };

        const tokenConfig: Token = type === 'access' ? accessTokenConfig : refreshTokenConfig;

        const token = this.jwtService.sign(payload, tokenConfig);

        return token;
    }
}
