// @nestjs
import { Module } from '@nestjs/common';
// modules
import { CoreModule } from '@common/modules/core.module';
import { UsersModule } from '@models/users/users.module';
import { ServersModule } from '@models/servers/servers.module';
// controllers
import { MypageController } from './mypage.controller';

// ----------------------------------------------------------------------

@Module({
    imports: [CoreModule, UsersModule, ServersModule],
    controllers: [MypageController],
    providers: [],
})
export class MypageModule {}
