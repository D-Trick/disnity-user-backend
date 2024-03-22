// types
import type { Channel } from '@models/discord-api/types/discord-api.type';
// lib
import { Exclude, Expose } from 'class-transformer';

// ----------------------------------------------------------------------

export class ChannelListResponseDto {
    @Exclude() private readonly _id: Channel['id'];
    @Exclude() private readonly _type: Channel['type'];
    @Exclude() private readonly _last_message_id: Channel['last_message_id'];
    @Exclude() private readonly _flags: Channel['flags'];
    @Exclude() private readonly _guild_id: Channel['guild_id'];
    @Exclude() private readonly _name: Channel['name'];
    @Exclude() private readonly _parent_id: Channel['parent_id'];
    @Exclude() private readonly _rate_limit_per_user: Channel['rate_limit_per_user'];
    @Exclude() private readonly _topic: Channel['topic'];
    @Exclude() private readonly _position: Channel['position'];
    @Exclude() private readonly _permission_overwrites: Channel['permission_overwrites'];
    @Exclude() private readonly _nsfw: Channel['nsfw'];

    constructor(channel: Channel) {
        this._id = channel.id;
        this._type = channel.type;
        this._last_message_id = channel.last_message_id;
        this._flags = channel.flags;
        this._guild_id = channel.guild_id;
        this._name = channel.name;
        this._parent_id = channel.parent_id;
        this._rate_limit_per_user = channel.rate_limit_per_user;
        this._topic = channel.topic;
        this._position = channel.position;
        this._permission_overwrites = channel.permission_overwrites;
        this._nsfw = channel.nsfw;
    }

    @Expose()
    get id() {
        return this._id;
    }

    @Expose()
    get type() {
        return this._type;
    }

    @Expose()
    get last_message_id() {
        return this._last_message_id;
    }

    @Expose()
    get flags() {
        return this._flags;
    }

    @Expose()
    get guild_id() {
        return this._guild_id;
    }

    @Expose()
    get name() {
        return this._name;
    }

    @Expose()
    get parent_id() {
        return this._parent_id;
    }

    @Expose()
    get rate_limit_per_user() {
        return this._rate_limit_per_user;
    }

    @Expose()
    get topic() {
        return this._topic;
    }

    @Expose()
    get position() {
        return this._position;
    }

    @Expose()
    get permission_overwrites() {
        return this._permission_overwrites;
    }

    @Expose()
    get nsfw() {
        return this._nsfw;
    }
}
