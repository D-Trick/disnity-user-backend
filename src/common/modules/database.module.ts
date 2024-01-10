// @nestjs
import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
// configs
import { mysqlConfig } from '@config/database.config';
// modules
import { TypeOrmCutomModule } from './typeorm-custom-repository.module';
// repositories
import { TagRepository } from '@databases/repositories/tag';
import { MenuRepository } from '@databases/repositories/menu';
import { UserRepository } from '@databases/repositories/user';
import { EmojiRepository } from '@databases/repositories/emoji';
import { GuildRepository } from '@databases/repositories/guild';
import { AccessLogRepository } from '@databases/repositories/access-log';
import { CommonCodeRepository } from '@databases/repositories/common-code';
import { GuildScheduledRepository } from '@databases/repositories/guild-scheduled';
import { GuildAdminPermissionRepository } from '@databases/repositories/guild-admin-permission';

// ----------------------------------------------------------------------

const Repositories = TypeOrmCutomModule.forCustomRepository([
    TagRepository,
    MenuRepository,
    UserRepository,
    GuildRepository,
    EmojiRepository,
    AccessLogRepository,
    CommonCodeRepository,
    GuildScheduledRepository,
    GuildAdminPermissionRepository,
]);

@Global()
@Module({
    imports: [TypeOrmModule.forRoot(mysqlConfig), Repositories],
    exports: [Repositories],
})
export class DatabaseModule {}
