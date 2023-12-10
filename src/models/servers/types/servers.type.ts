// types
import type { FindGuildDetailById } from '@databases/types/guild.type';
// entities
import { Tag } from '@databases/entities/tag.entity';
import { Emoji } from '@databases/entities/emoji.entity';
import { FindGuildAdmins } from '@databases/types/guild-admin-permission.type';

// ----------------------------------------------------------------------

export interface ServerDetail extends FindGuildDetailById {
    tags: Partial<Pick<Tag, 'name'>>[];
    admins: FindGuildAdmins[];
    emojis: Partial<Pick<Emoji, 'id' | 'name' | 'animated'>>[];
    animate_emojis: Partial<Pick<Emoji, 'id' | 'name' | 'animated'>>[];
}
