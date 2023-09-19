// types
import type { SqlOptions } from '@common/types/sql-options.type';
import type { SelectBooleanified } from './global';
import type { sort, min, max } from '@common/types/select-filter.type';
// entities
import { Tag } from '@databases/entities/tag.entity';
import { User } from '@databases/entities/user.entity';
import { Guild } from '@databases/entities/guild.entity';

// ----------------------------------------------------------------------

/******************************
 * CommonCount
 ******************************/
export interface TotalCategoryGuildsCountOptions extends SqlOptions {
    where?: Partial<Pick<Guild, 'category_id'>> & {
        keyword?: string;
        min?: min;
        max?: max;
    };
}

export interface TotalSearchGuildsCountOptions extends SqlOptions {
    where: {
        keyword?: string;
        min?: min;
        max?: max;
    };
}

export interface TotalMyGuildsCountOptions extends SqlOptions {
    where: {
        user_id: Guild['user_id'];
    };
}

export interface TotalGuildAdminsCountOptions extends SqlOptions {
    where: Partial<Pick<Guild, 'id' | 'user_id'>>;
}

/******************************
 * Select
 ******************************/
export type SelectSqlName = 'serverUrls' | 'publicList' | 'publicDetail' | 'columns';

export interface SelectOptions extends SqlOptions {
    select: {
        columns?: SelectBooleanified<Guild>;
        sql?: {
            serverUrls?: boolean;
            publicList?: boolean;
            publicDetail?: boolean;
        };
    };

    where: Partial<Pick<Guild, 'id' | 'user_id' | 'is_open' | 'is_admin_open' | 'is_bot'>> & {
        IN?: {
            ids: Guild['id'][];
        };
    };
}

export interface SelectMyGuildOptions extends SqlOptions {
    select: {
        columns?: SelectBooleanified<Guild>;
    };

    where: Pick<Guild, 'id' | 'user_id'>;
}

export interface ReturnSelect {
    serverUrls: {
        url: string;
    };
    publicList: Pick<
        Guild,
        'id' | 'name' | 'summary' | 'icon' | 'online' | 'member' | 'link_type' | 'membership_url' | 'refresh_date'
    >;
    publicDetail: Pick<
        Guild,
        | 'id'
        | 'name'
        | 'content'
        | 'is_markdown'
        | 'icon'
        | 'link_type'
        | 'online'
        | 'member'
        | 'premium_tier'
        | 'membership_url'
        | 'created_at'
        | 'updated_at'
        | 'refresh_date'
    >;

    columns: Partial<Guild>;
}

/******************************
 * FindPublicServersByCriteria
 ******************************/
export interface FindPublicServersByCriteriaOptions extends SqlOptions {
    where: {
        IN?: {
            ids: Guild['id'][];
        };
    };
}

/******************************
 * FindGuildDetailByIdOptions
 ******************************/
export interface FindGuildDetailByIdOptions extends SqlOptions {
    where: Partial<Pick<Guild, 'id'>>;
}
export interface FindGuildDetailById
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
        | 'created_at'
        | 'refresh_date'
    > {
    category_name: string;
    tags: Pick<Tag, 'name'>[];
    admins: Pick<User, 'id' | 'global_name' | 'username' | 'avatar' | 'discriminator'>[];
}

/******************************
 * FindMyGuildDetailByIdOptions
 ******************************/
export interface FindMyGuildDetailByIdOptions extends SqlOptions {
    where: Pick<Guild, 'id' | 'user_id'>;
}
export interface FindMyGuildDetailById
    extends Pick<
        Guild,
        | 'id'
        | 'category_id'
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
        | 'created_at'
        | 'refresh_date'
    > {
    category_name: string;
    tags: Pick<Tag, 'name'>[];
    admins: Pick<User, 'id' | 'global_name' | 'username' | 'avatar' | 'discriminator'>[];
}

/******************************
 * FindGuildsByIds
 ******************************/
export type FindGuildsByIdsSqlName = 'base' | 'myGuild';

export interface FindGuildsByIdsOptions extends SqlOptions {
    select: {
        sql?: {
            base?: boolean;
            myGuild?: boolean;
        };
    };
    where: Partial<Pick<Guild, 'category_id'>> & {
        keyword?: string;
        min?: min;
        max?: max;

        IN: {
            ids: number[];
        };
    };

    orderBy?: {
        sort?: sort;
    };
}
export interface ReturnFindGuildsByIds {
    base: Pick<
        Guild,
        'id' | 'name' | 'summary' | 'icon' | 'online' | 'member' | 'banner' | 'link_type' | 'refresh_date'
    > & {
        category_name: string;
        tags: Pick<Tag, 'id' | 'name'>[];
    };

    myGuild: Pick<
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
        | 'refresh_date'
        | 'is_open'
        | 'is_admin_open'
        | 'private_reason'
        | 'is_bot'
        | 'user_id'
    > & {
        category_name: string;
        tags: Pick<Tag, 'id' | 'name'>[];
    };
}

/******************************
 * FindCategoryGuildIds
 ******************************/
export interface FindCategoryGuildIdsOptions extends SqlOptions {
    where?: Partial<Pick<Guild, 'category_id'>> & {
        keyword?: string;
        min?: min;
        max?: max;
    };

    orderBy?: {
        sort?: sort;
    };
}

/******************************
 * FindSearchGuildIds
 ******************************/
export interface FindSearchGuildIdsOptions extends SqlOptions {
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
 * FindMyGuildIds
 ******************************/
export interface FindMyGuildIdsOptions extends SqlOptions {
    where: {
        user_id: string;
    };

    orderBy?: {
        sort?: sort;
    };
}

/******************************
 * FindSitemapUrls
 ******************************/
export interface FindSitemapUrls {
    url: string;
}

/******************************
 * DML
 ******************************/
export interface InsertOptions extends SqlOptions {
    values: Guild | Guild[];
}
export interface UpdateOptions extends SqlOptions {
    values: Partial<Guild>;
    where: Partial<Pick<Guild, 'id' | 'user_id'>>;
}
export interface BulkUpdateOptions extends SqlOptions {
    values: Partial<Guild>[];
    where: {
        IN: {
            ids: Guild['id'][];
        };
    };
}
export interface DeleteOptions extends SqlOptions {
    where: Partial<Pick<Guild, 'id' | 'user_id'>>;
}
