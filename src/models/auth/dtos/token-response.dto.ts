// lib
import { Exclude, Expose } from 'class-transformer';

// ----------------------------------------------------------------------

export class TokenResponseDto {
    @Exclude() private readonly _accessToken: string;
    @Exclude() private readonly _refreshToken: string;

    constructor(accessToken: string, refreshToken: string) {
        this._accessToken = accessToken;
        this._refreshToken = refreshToken;
    }

    @Expose()
    get accessToken() {
        return this._accessToken;
    }

    @Expose()
    get refreshToken() {
        return this._refreshToken;
    }
}
