// @nestjs
import { Injectable } from '@nestjs/common';
// configs
import { AuthTokenService } from './services/token.service';

// ----------------------------------------------------------------------

@Injectable()
export class AuthService {
    /**************************************************
     * Constructor
     **************************************************/
    constructor(private readonly tokenService: AuthTokenService) {}

    /**************************************************
     * Public Methods
     **************************************************/
    /******************************
     * tokenService
     ******************************/
    /**
     * JWT Token 생성
     * @param {'access' | 'refresh'} type
     * @param {string} userId
     */
    createJwtToken(type: 'access' | 'refresh', userId: string) {
        return this.tokenService.createJwtToken(type, userId);
    }
}
