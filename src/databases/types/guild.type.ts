// types
import type { SqlOptions } from '@common/types/sql-options.type';
import type { SelectBooleanified } from './global';
// lib
import { FindManyOptions, FindOneOptions, QueryRunner } from 'typeorm';
// entities
import { Tag } from '@databases/entities/tag.entity';
import { Guild } from '@databases/entities/guild.entity';

// ----------------------------------------------------------------------

/******************************
 * CommonCount
 ******************************/
export interface TotalCategoryGuildsCountOptions extends SqlOptions {
    where?: Partial<Pick<Guild, 'category_id'>> & {
        keyword?: string;
        min?: number;
        max?: number;
    };
}

export interface TotalSearchGuildsCountOptions extends SqlOptions {
    where: {
        keyword?: string;
        min?: number;
        max?: number;
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
 * Find
 ******************************/
export interface CFindOptions extends Omit<FindManyOptions<Guild>, 'transaction'> {
    transaction?: QueryRunner;
    preSelect?: {
        frequentlyUsed?: boolean;
    };
}
export interface CFindOneOptions extends Omit<FindOneOptions<Guild>, 'transaction'> {
    transaction?: QueryRunner;
    preSelect?: {
        frequentlyUsed?: boolean;
    };
}

/******************************
 * Select
 ******************************/
export interface SelectMyGuildOptions extends SqlOptions {
    select: {
        columns?: SelectBooleanified<Guild>;
    };

    where: Pick<Guild, 'id' | 'user_id'>;
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
        min?: number;
        max?: number;

        IN: {
            ids: number[];
        };
    };

    orderBy?: {
        sort?: string;
    };
}
export interface FindGuildsByIds {
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
        min?: number;
        max?: number;
    };

    orderBy?: {
        sort?: string;
    };
}

/******************************
 * FindSearchGuildIds
 ******************************/
export interface FindSearchGuildIdsOptions extends SqlOptions {
    where: {
        keyword: string;
        min?: number;
        max?: number;
    };

    orderBy?: {
        sort?: string;
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
        sort?: string;
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
