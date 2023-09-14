// lib
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
// configs
import { Token, accessTokenConfig, refreshTokenConfig } from '@config/jwt.config';

// ----------------------------------------------------------------------

@Injectable()
export class AuthService {
    /**************************************************
     * Constructor
     **************************************************/
    constructor(private jwtService: JwtService) {}

    /**************************************************
     * Public Methods
     **************************************************/
    createJwtToken(type: string, userId: string): string {
        const payload: { id: string } = {
            id: userId,
        };

        const tokenConfig: Token = type === 'access' ? accessTokenConfig : refreshTokenConfig;

        const token = this.jwtService.sign(payload, tokenConfig);

        return token;
    }
}
