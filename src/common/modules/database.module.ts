// lib
import { Global, Module } from '@nestjs/common';
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
import { GuildsScheduledRepository } from '@databases/repositories/guild-scheduled';
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
    GuildsScheduledRepository,
    GuildAdminPermissionRepository,
]);

@Global()
@Module({
    imports: [Repositories],
    exports: [Repositories],
})
export class DatabaseModule {}
