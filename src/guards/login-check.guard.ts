// @nestjs
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// ----------------------------------------------------------------------

@Injectable()
export class LoginCheckGuard extends AuthGuard('jwt') {
    handleRequest(error: any, user: any) {
        const isLogin = !user || error ? false : true;

        return {
            ...user,
            isLogin,
        };
    }
}
