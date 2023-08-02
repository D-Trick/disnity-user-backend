// lib
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
// strategy
import { DiscordStrategy } from '@models/auth/passport/strategys/discord.strategy';
import { JwtStrategy } from '@models/auth/passport/strategys/jwt.strategy';
// configs
import { jwtConfig } from '@config/jwt.config';
// modules
import { CoreModule } from '@common/modules/core.module';
import { UsersModule } from '@models/users/users.module';
// controllers
import { AuthController } from './auth.controller';
// services
import { AuthService } from './auth.service';

// ----------------------------------------------------------------------

@Module({
    imports: [CoreModule, UsersModule, PassportModule, JwtModule.register(jwtConfig)],
    controllers: [AuthController],
    providers: [AuthService, DiscordStrategy, JwtStrategy],
    exports: [AuthService],
})
export class AuthModule {}
