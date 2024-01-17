// @nestjs
import { AuthUserDto } from '@models/auth/dtos/auth-user.dto';
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// ----------------------------------------------------------------------

@Injectable()
export class AuthGuardLoginCheck extends AuthGuard('jwt') {
    override handleRequest(error: any, user: any) {
        if (!user || error) {
            return AuthUserDto.create({ isLogin: false });
        }

        return user;
    }
}
