// entities
import { Emoji } from '@databases/entities/emoji.entity';

// ----------------------------------------------------------------------

/******************************
 * Select
 ******************************/
export type Select = Pick<Emoji, 'id' | 'name'>;
