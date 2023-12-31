// @nestjs
import { Module } from '@nestjs/common';
// modules
import { UsersModule } from '@models/users/users.module';
import { ServersModule } from '@models/servers/servers.module';
// controllers
import { MypageController } from './mypage.controller';

// ----------------------------------------------------------------------

@Module({
    imports: [UsersModule, ServersModule],
    controllers: [MypageController],
})
export class MypageModule {}
