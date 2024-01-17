// lib
import { Exclude, Expose } from 'class-transformer';
// entities
import { AdminGuild } from '../types/users.type';

// ----------------------------------------------------------------------

export class AdminGuildResponseDto {
    @Exclude() private readonly _id: AdminGuild['id'];
    @Exclude() private readonly _name: AdminGuild['name'];
    @Exclude() private readonly _icon: AdminGuild['icon'];
    @Exclude() private readonly _owner: AdminGuild['owner'];
    @Exclude() private readonly _permissions: AdminGuild['permissions'];
    @Exclude() private readonly _permissions_new: AdminGuild['permissions_new'];
    @Exclude() private readonly _features: AdminGuild['features'];

    @Exclude() private readonly _channels: AdminGuild['channels'];

    constructor(adminGuild: AdminGuild) {
        this._id = adminGuild.id;
        this._name = adminGuild.name;
        this._icon = adminGuild.icon;
        this._owner = adminGuild.owner;
        this._permissions = adminGuild.permissions;
        this._permissions_new = adminGuild.permissions_new;
        this._features = adminGuild.features;

        this._channels = adminGuild.channels;
    }

    @Expose()
    get id() {
        return this._id;
    }

    @Expose()
    get name() {
        return this._name;
    }

    @Expose()
    get icon() {
        return this._icon;
    }

    @Expose()
    get owner() {
        return this._owner;
    }

    @Expose()
    get permissions() {
        return this._permissions;
    }

    @Expose()
    get permissions_new() {
        return this._permissions_new;
    }

    @Expose()
    get features() {
        return this._features;
    }

    @Expose()
    get channels() {
        return this._channels;
    }
}
