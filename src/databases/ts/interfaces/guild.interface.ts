// types
import type { SqlOptions } from '@common/ts/interfaces/sql-options.interface';
import type { sort, min, max } from '@common/ts/interfaces/select-filter.interface';
// entities
import { Tag } from '@databases/entities/tag.entity';
import { User } from '@databases/entities/user.entity';
import { Guild } from '@databases/entities/guild.entity';

// ----------------------------------------------------------------------

/******************************
 * CommonCount
 ******************************/
export interface Count {
    count: string;
}

export interface TotalCountOptions extends SqlOptions {
    where?: {
        keyword?: string;
        category_id?: number;
        user_id?: string;
        min?: min;
        max?: max;
    };
}

export interface SearchTotalCountOptions extends SqlOptions {
    where: {
        keyword: string;
        min?: min;
        max?: max;
    };
}

export interface AdminTotalCountOptions extends SqlOptions {
    where: {
        id: string;
        user_id: string;
    };
}

/******************************
 * Select
 ******************************/
export interface SelectOptions extends SqlOptions {
    where?: {
        id?: string;
        user_id?: string;
        wirter_id?: string;
    };
}

/******************************
 * FindDetail
 ******************************/
export interface FindDetailOptions extends SqlOptions {
    where: {
        id: string;
        user_id?: string;
    };
}
export interface FindDetail
    extends Pick<
        Guild,
        | 'id'
        | 'name'
        | 'summary'
        | 'content'
        | 'is_markdown'
        | 'icon'
        | 'splash'
        | 'online'
        | 'member'
        | 'premium_tier'
        | 'link_type'
        | 'invite_code'
        | 'membership_url'
        | 'is_open'
        | 'is_bot'
        | 'created_at'
        | 'updated_at'
        | 'server_refresh_date'
    > {
    category_id: string;
    category_name: string;
    tags: Pick<Tag, 'name'>[];
    admins: Pick<User, 'id' | 'global_name' | 'username' | 'avatar' | 'discriminator'>[];
}

/******************************
 * FindMany
 ******************************/
export interface FindManyOptions extends SqlOptions {
    where?: {
        keyword?: string;
        category_id?: number;
        user_id?: string;
        min?: min;
        max?: max;

        IN?: {
            ids?: number[];
        };
    };

    orderBy?: {
        sort?: sort;
    };
}
export interface FindMany
    extends Pick<
        Guild,
        | 'id'
        | 'name'
        | 'summary'
        | 'icon'
        | 'online'
        | 'member'
        | 'banner'
        | 'link_type'
        | 'invite_code'
        | 'is_open'
        | 'is_admin_open'
        | 'private_reason'
        | 'is_bot'
        | 'created_at'
        | 'updated_at'
        | 'server_refresh_date'
    > {
    category_name: string;
    tags: Pick<Tag, 'id' | 'name'>[];
    is_writer: number;
}

/******************************
 * GetIds
 ******************************/
export interface GetIdsOptions extends SqlOptions {
    where?: {
        keyword?: string;
        category_id?: number;
        user_id?: string;
        min?: min;
        max?: max;

        IN?: {
            ids?: number[];
        };
    };

    orderBy?: {
        sort?: sort;
    };
}

/******************************
 * GetIdsBySearch
 ******************************/
export interface GetIdsBySearchOptions extends SqlOptions {
    where: {
        keyword: string;
        min?: min;
        max?: max;
    };

    orderBy?: {
        sort?: sort;
    };
}

/******************************
 * DML
 ******************************/
export interface InsertOptions extends SqlOptions {
    values: Guild | Guild[];
}
export interface UpdateOptions extends SqlOptions {
    values: Partial<Guild>;
    where: {
        id?: string;
        guild_id?: string;
        user_id?: string;
    };
}
export interface BulkUpdateOptions extends SqlOptions {
    values: Partial<Guild>[];
    where: {
        IN: {
            ids: string[];
        };
    };
}
export interface DeleteOptions extends SqlOptions {
    where: {
        id?: string;
        guild_id?: string;
        user_id?: string;
    };
}
