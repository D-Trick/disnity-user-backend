// types
import type { SqlOptions } from '@common/types/sql-options.type';
// lib
import { FindManyOptions, FindOneOptions, QueryRunner } from 'typeorm';
// entities
import { Tag } from '@databases/entities/tag.entity';
import { Guild } from '@databases/entities/guild.entity';
import { CommonCode } from '@databases/entities/common-code.entity';

// ----------------------------------------------------------------------

/******************************
 * CommonCount
 ******************************/
export interface TotalCategoryGuildsCountOptions extends SqlOptions {
    where?: {
        category_id?: Guild['category_id'];

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
    where: {
        id?: Guild['id'];
        user_id?: Guild['user_id'];
    };
}

/******************************
 * Find
 ******************************/
export interface CFindOptions extends Omit<FindManyOptions<Guild>, 'transaction'> {
    transaction?: QueryRunner;
}
export interface CFindOneOptions extends Omit<FindOneOptions<Guild>, 'transaction'> {
    transaction?: QueryRunner;
}

/******************************
 * FindMyGuild
 ******************************/
export interface FindMyGuildOptions extends SqlOptions {
    where: {
        id: Guild['id'];
        user_id: Guild['user_id'];
    };
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
 * FindGuildDetailById
 ******************************/
export interface FindGuildDetailByIdOptions extends SqlOptions {
    where: {
        id?: Guild['id'];
    };
}
export interface FindGuildDetailById {
    id: Guild['id'];
    category_id: Guild['category_id'];
    name: Guild['name'];
    summary: Guild['summary'];
    content: Guild['content'];
    is_markdown: Guild['is_markdown'];
    icon: Guild['icon'];
    splash: Guild['splash'];
    online: Guild['online'];
    member: Guild['member'];
    premium_tier: Guild['premium_tier'];
    link_type: Guild['link_type'];
    invite_code: Guild['invite_code'];
    membership_url: Guild['membership_url'];
    is_open: Guild['is_open'];
    created_at: Guild['created_at'];
    refresh_date: Guild['refresh_date'];

    category_name: CommonCode['value'];
}

/******************************
 * FindMyGuildDetailById
 ******************************/
export interface FindMyGuildDetailByIdOptions extends SqlOptions {
    where: {
        id: Guild['id'];
        user_id: Guild['user_id'];
    };
}
export interface FindMyGuildDetailById {
    id: Guild['id'];
    category_id: Guild['category_id'];
    name: Guild['name'];
    summary: Guild['summary'];
    content: Guild['content'];
    is_markdown: Guild['is_markdown'];
    icon: Guild['icon'];
    splash: Guild['splash'];
    online: Guild['online'];
    member: Guild['member'];
    premium_tier: Guild['premium_tier'];
    link_type: Guild['link_type'];
    invite_code: Guild['invite_code'];
    membership_url: Guild['membership_url'];
    is_open: Guild['is_open'];
    created_at: Guild['created_at'];
    refresh_date: Guild['refresh_date'];

    category_name: CommonCode['value'];
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
    where: {
        category_id?: Guild['category_id'];

        keyword?: string;
        min?: number;
        max?: number;

        IN: {
            ids: Guild['id'][];
        };
    };

    orderBy?: {
        sort?: string;
    };
}
export interface FindGuildsByIds {
    base: {
        id: Guild['id'];
        name: Guild['name'];
        summary: Guild['summary'];
        icon: Guild['icon'];
        online: Guild['online'];
        member: Guild['member'];
        banner: Guild['banner'];
        link_type: Guild['link_type'];
        refresh_date: Guild['refresh_date'];

        category_name: CommonCode['value'];

        tags: {
            id: Tag['id'];
            name: Tag['name'];
        }[];
    };

    myGuild: {
        id: Guild['id'];
        user_id: Guild['user_id'];
        name: Guild['name'];
        summary: Guild['summary'];
        icon: Guild['icon'];
        online: Guild['online'];
        member: Guild['member'];
        banner: Guild['banner'];
        link_type: Guild['link_type'];
        invite_code: Guild['invite_code'];
        refresh_date: Guild['refresh_date'];
        is_open: Guild['is_open'];
        is_admin_open: Guild['is_admin_open'];
        private_reason: Guild['private_reason'];
        is_bot: Guild['is_bot'];

        category_name: CommonCode['value'];

        tags: {
            id: Tag['id'];
            name: Tag['name'];
        }[];
    };
}

/******************************
 * FindCategoryGuildIds
 ******************************/
export interface FindCategoryGuildIdsOptions extends SqlOptions {
    where?: {
        category_id?: Guild['category_id'];

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
 * 쓰기, 수정, 삭제
 ******************************/
export interface InsertOptions extends SqlOptions {
    values: Guild | Guild[];
}
export interface UpdateOptions extends SqlOptions {
    values: Partial<Guild>;
    where: {
        id?: Guild['id'];
        user_id?: Guild['user_id'];
    };
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
    where: {
        id?: Guild['id'];
        user_id?: Guild['user_id'];
    };
}
