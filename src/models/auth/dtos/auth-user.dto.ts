// types
import { AuthUser } from '../types/auth.type';
// lib
import { Exclude, Expose } from 'class-transformer';

// ----------------------------------------------------------------------

export class AuthUserDto {
    @Exclude() private readonly _id?: string;
    @Exclude() private readonly _isLogin?: boolean;

    constructor(user: Partial<AuthUser>) {
        this._id = user?.id;
        this._isLogin = user?.isLogin || false;
    }

    static create(user: Partial<AuthUser>) {
        return new AuthUserDto(user);
    }

    @Expose()
    get id() {
        return this._id;
    }

    @Expose()
    get isLogin() {
        return this._isLogin;
    }
}
