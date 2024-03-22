// @nestjs
import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';
// configs
import { ACCESS_TOKEN_SIGN_CONFIG, REFRESH_TOKEN_SIGN_CONFIG } from '@config/jwt.config';

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
    createJwt(type: 'access' | 'refresh', userId: string): string {
        const payload = {
            id: userId,
        };

        if (type === 'access') {
            return this.jwtService.sign(payload, ACCESS_TOKEN_SIGN_CONFIG);
        } else {
            return this.jwtService.sign(payload, REFRESH_TOKEN_SIGN_CONFIG);
        }
    }
}
