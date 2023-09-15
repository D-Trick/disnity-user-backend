// types
import type { FindGuildDetailById } from '@databases/types/guild.type';
// entities
import { Emoji } from '@databases/entities/emoji.entity';

// ----------------------------------------------------------------------

export interface ServerDetail extends FindGuildDetailById {
    emojis: Partial<Pick<Emoji, 'id' | 'name' | 'animated'>>[];
    animate_emojis: Partial<Pick<Emoji, 'id' | 'name' | 'animated'>>[];
}
