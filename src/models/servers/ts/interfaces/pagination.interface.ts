// types
import type { FindMany } from '@databases/ts/interfaces/guild.interface';

// ----------------------------------------------------------------------

export interface ServerPagination {
    totalCount: number;
    keyword?: string;
    tagName?: string;
    categoryName?: string;
    list: FindMany[];
}
