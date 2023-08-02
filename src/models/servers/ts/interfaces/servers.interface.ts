// types
import { Select } from '@databases/ts/types/emoji.type';
import type { FindDetail } from '@databases/ts/interfaces/guild.interface';

// ----------------------------------------------------------------------

export interface ServerDetail extends FindDetail {
    emojis: Select[];
    animate_emojis: Select[];
}
