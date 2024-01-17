// @nestjs
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
// strategy
import { DiscordStrategy } from '@models/auth/passport/strategys/discord.strategy';
import { JwtStrategy } from '@models/auth/passport/strategys/jwt.strategy';
// configs
import { jwtConfig } from '@config/jwt.config';
// modules
import { UsersModule } from '@models/users/users.module';
// controllers
import { AuthController } from './auth.controller';
// services
import { AuthService } from './auth.service';
import { AuthTokenService } from './services/token.service';

// ----------------------------------------------------------------------

@Module({
    imports: [JwtModule.register(jwtConfig), PassportModule, UsersModule],
    controllers: [AuthController],
    providers: [JwtStrategy, DiscordStrategy, AuthService, AuthTokenService],
    exports: [AuthService],
})
export class AuthModule {}
