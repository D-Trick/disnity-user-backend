// types
import { ServerDetail } from '../types/servers.type';
// lib
import { Exclude, Expose } from 'class-transformer';
// utils
import { dateTimeFormat } from '@utils/format-date';
// entities
import { Emoji } from '@databases/entities/emoji.entity';

// ----------------------------------------------------------------------

export class ServerResponseDto {
    @Exclude() private readonly _id: ServerDetail['id'];
    @Exclude() private readonly _category_id: ServerDetail['category_id'];
    @Exclude() private readonly _name: ServerDetail['name'];
    @Exclude() private readonly _summary: ServerDetail['summary'];
    @Exclude() private readonly _content: ServerDetail['content'];
    @Exclude() private readonly _is_markdown: ServerDetail['is_markdown'];
    @Exclude() private readonly _icon: ServerDetail['icon'];
    @Exclude() private readonly _splash: ServerDetail['splash'];
    @Exclude() private readonly _online: ServerDetail['online'];
    @Exclude() private readonly _member: ServerDetail['member'];
    @Exclude() private readonly _premium_tier: ServerDetail['premium_tier'];
    @Exclude() private readonly _link_type: ServerDetail['link_type'];
    @Exclude() private readonly _invite_code: ServerDetail['invite_code'];
    @Exclude() private readonly _membership_url: ServerDetail['membership_url'];
    @Exclude() private readonly _is_open: ServerDetail['is_open'];
    @Exclude() private readonly _created_at: ServerDetail['created_at'];
    @Exclude() private readonly _refresh_date: ServerDetail['refresh_date'];
    @Exclude() private readonly _category_name: ServerDetail['name'];

    @Exclude() private readonly _tags: Pick<Emoji, 'name'>[];
    @Exclude() private readonly _admins: ServerDetail['admins'];
    @Exclude() private readonly _emojis: Pick<Emoji, 'id' | 'name' | 'animated'>[];
    @Exclude() private readonly _animate_emojis: Pick<Emoji, 'id' | 'name' | 'animated'>[];

    constructor(server: ServerDetail) {
        this._id = server.id;
        this._category_id = server.category_id;
        this._name = server.name;
        this._summary = server.summary;
        this._content = server.content;
        this._is_markdown = server.is_markdown;
        this._icon = server.icon;
        this._splash = server.splash;
        this._online = server.online;
        this._member = server.member;
        this._premium_tier = server.premium_tier;
        this._link_type = server.link_type;
        this._invite_code = server.invite_code;
        this._membership_url = server.membership_url;
        this._created_at = dateTimeFormat(server.created_at);
        this._refresh_date = dateTimeFormat(server.refresh_date);
        this._category_name = server.name;

        this._tags = server.tags.map((tag) => ({
            name: tag.name,
        }));
        this._admins = server.admins;
        this._emojis = server.emojis.map((emoji) => ({
            id: emoji.id,
            name: emoji.name,
            animated: emoji.animated,
        }));
        this._animate_emojis = server.animate_emojis.map((animateEmoji) => ({
            id: animateEmoji.id,
            name: animateEmoji.name,
            animated: animateEmoji.animated,
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

    @Expose()
    get admins() {
        return this._admins;
    }

    @Expose()
    get emojis() {
        return this._emojis;
    }

    @Expose()
    get animate_emojis() {
        return this._animate_emojis;
    }
}
