// type
import type { CacheUser } from '@cache/types';
// lib
import { Exclude, Expose } from 'class-transformer';
// entities
import { User } from '@databases/entities/user.entity';

// ----------------------------------------------------------------------

export class UserResponseDto {
    @Exclude() private readonly _id: User['id'];
    @Exclude() private readonly _global_name: User['global_name'];
    @Exclude() private readonly _username: User['username'];
    @Exclude() private readonly _discriminator: User['discriminator'];
    @Exclude() private readonly _email: User['email'];
    @Exclude() private readonly _verified: User['verified'];
    @Exclude() private readonly _avatar: User['avatar'];
    @Exclude() private readonly _locale: User['locale'];
    @Exclude() private readonly _created_at: User['created_at'];
    @Exclude() private readonly _updated_at: User['updated_at'];

    constructor(user: CacheUser) {
        this._id = user.id;
        this._global_name = user.global_name;
        this._username = user.username;
        this._discriminator = user.discriminator;
        this._email = user.email;
        this._verified = user.verified;
        this._avatar = user.avatar;
        this._locale = user.locale;
        this._created_at = user.created_at;
        this._updated_at = user.updated_at;
    }

    @Expose()
    get id() {
        return this._id;
    }

    @Expose()
    get global_name() {
        return this._global_name;
    }

    @Expose()
    get username() {
        return this._username;
    }

    @Expose()
    get discriminator() {
        return this._discriminator;
    }

    @Expose()
    get email() {
        return this._email;
    }

    @Expose()
    get verified() {
        return this._verified;
    }

    @Expose()
    get avatar() {
        return this._avatar;
    }

    @Expose()
    get locale() {
        return this._locale;
    }

    @Expose()
    get created_at() {
        return this._created_at;
    }

    @Expose()
    get updated_at() {
        return this._updated_at;
    }
}
