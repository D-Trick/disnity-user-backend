// @nestjs
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
// strategy
import { DiscordStrategy } from '@models/auth/passport/strategys/discord.strategy';
import { JwtStrategy } from '@models/auth/passport/strategys/jwt.strategy';
// configs
import { JWT_MODULE_CONFIG } from '@config/jwt.config';
// modules
import { UsersModule } from '@models/users/users.module';
// controllers
import { AuthController } from './auth.controller';
// services
import { AuthTokenService } from './services/token.service';

// ----------------------------------------------------------------------

@Module({
    imports: [JwtModule.register(JWT_MODULE_CONFIG), PassportModule, UsersModule],
    controllers: [AuthController],
    providers: [JwtStrategy, DiscordStrategy, AuthTokenService],
    exports: [AuthTokenService],
})
export class AuthModule {}
