// lib
import { Global, Module } from '@nestjs/common';
// modules
import { TypeOrmCutomModule } from './typeorm-custom-repository.module';
// repositorys
import { TagRepository } from '@databases/repositories/tag.repository';
import { MenuRepository } from '@databases/repositories/menu.repository';
import { UserRepository } from '@databases/repositories/user.repository';
import { EmojiRepository } from '@databases/repositories/emoji.repository';
import { GuildRepository } from '@databases/repositories/guild.repository';
import { AccessLogRepository } from '@databases/repositories/access-log.repository';
import { CommonCodeRepository } from '@databases/repositories/common-code.repository';
import { ServerAdminPermissionRepository } from '@databases/repositories/server-admin-permission.repository';
import { GuildsScheduledRepository } from '@databases/repositories/guilds-scheduled.repository';

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
    ServerAdminPermissionRepository,
]);

@Global()
@Module({
    imports: [Repositories],
    exports: [Repositories],
})
export class DatabaseModule {}
