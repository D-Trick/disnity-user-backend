// types
import type { FindMyGuildDetailById } from '@databases/types/guild.type';
// lib
import { Exclude, Expose } from 'class-transformer';
// utils
import { dateTimeFormat } from '@utils/format-date';
// entities
import { Tag } from '@databases/entities/tag.entity';
import { CommonCode } from '@databases/entities/common-code.entity';

// ----------------------------------------------------------------------
interface MyServer extends FindMyGuildDetailById {
    tags: Tag[];
}
// ----------------------------------------------------------------------

export class MyServerResponseDto {
    @Exclude() private readonly _id: FindMyGuildDetailById['id'];
    @Exclude() private readonly _category_id: FindMyGuildDetailById['category_id'];
    @Exclude() private readonly _name: FindMyGuildDetailById['name'];
    @Exclude() private readonly _summary: FindMyGuildDetailById['summary'];
    @Exclude() private readonly _content: FindMyGuildDetailById['content'];
    @Exclude() private readonly _is_markdown: FindMyGuildDetailById['is_markdown'];
    @Exclude() private readonly _icon: FindMyGuildDetailById['icon'];
    @Exclude() private readonly _splash: FindMyGuildDetailById['splash'];
    @Exclude() private readonly _online: FindMyGuildDetailById['online'];
    @Exclude() private readonly _member: FindMyGuildDetailById['member'];
    @Exclude() private readonly _premium_tier: FindMyGuildDetailById['premium_tier'];
    @Exclude() private readonly _link_type: FindMyGuildDetailById['link_type'];
    @Exclude() private readonly _invite_code: FindMyGuildDetailById['invite_code'];
    @Exclude() private readonly _membership_url: FindMyGuildDetailById['membership_url'];
    @Exclude() private readonly _is_open: FindMyGuildDetailById['is_open'];
    @Exclude() private readonly _created_at: string;
    @Exclude() private readonly _refresh_date: string;
    @Exclude() private readonly _category_name: CommonCode['name'];
    @Exclude() private readonly _tags: { name: Tag['name'] }[];

    constructor(myServer: MyServer) {
        this._id = myServer.id;
        this._category_id = myServer.category_id;
        this._name = myServer.name;
        this._summary = myServer.summary;
        this._content = myServer.content;
        this._is_markdown = myServer.is_markdown;
        this._icon = myServer.icon;
        this._splash = myServer.splash;
        this._online = myServer.online;
        this._member = myServer.member;
        this._premium_tier = myServer.premium_tier;
        this._link_type = myServer.link_type;
        this._invite_code = myServer.invite_code;
        this._membership_url = myServer.membership_url;
        this._is_open = myServer.is_open;
        this._created_at = dateTimeFormat(myServer.created_at);
        this._refresh_date = dateTimeFormat(myServer.refresh_date);
        this._category_name = myServer.category_name;
        this._tags = myServer.tags.map((tag) => ({
            name: tag.name,
        }));
    }

    @Expose()
    get id() {
        return this._id;
    }

    @Expose()
    get category_id() {
        return this._category_id;
    }

    @Expose()
    get name() {
        return this._name;
    }

    @Expose()
    get summary() {
        return this._summary;
    }

    @Expose()
    get content() {
        return this._content;
    }

    @Expose()
    get is_markdown() {
        return this._is_markdown;
    }

    @Expose()
    get icon() {
        return this._icon;
    }

    @Expose()
    get splash() {
        return this._splash;
    }

    @Expose()
    get online() {
        return this._online;
    }

    @Expose()
    get member() {
        return this._member;
    }

    @Expose()
    get premium_tier() {
        return this._premium_tier;
    }

    @Expose()
    get link_type() {
        return this._link_type;
    }

    @Expose()
    get invite_code() {
        return this._invite_code;
    }

    @Expose()
    get membership_url() {
        return this._membership_url;
    }

    @Expose()
    get is_open() {
        return this._is_open;
    }

    @Expose()
    get created_at() {
        return this._created_at;
    }

    @Expose()
    get refresh_date() {
        return this._refresh_date;
    }

    @Expose()
    get category_name() {
        return this._category_name;
    }

    @Expose()
    get tags() {
        return this._tags;
    }
}
