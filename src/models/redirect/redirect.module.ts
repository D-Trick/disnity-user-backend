// @nestjs
import { Module } from '@nestjs/common';
// modules
import { UsersModule } from '@models/users/users.module';
import { ServersModule } from '@models/servers/servers.module';
// controllers
import { RedirectController } from './redirect.controller';

// ----------------------------------------------------------------------

@Module({
    imports: [UsersModule, ServersModule],
    controllers: [RedirectController],
})
export class RedirectModule {}
