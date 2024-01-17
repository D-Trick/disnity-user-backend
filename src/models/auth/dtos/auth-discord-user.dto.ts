// types
import type { AuthDiscordUser } from '../types/auth.type';
import type { UserGuild, discordString, snowflake } from '@models/discord-api/types/discordApi.type';
// lib
import { Exclude, Expose } from 'class-transformer';

// ----------------------------------------------------------------------

export class AuthDiscordUserDto {
    @Exclude() private readonly _id: snowflake;
    @Exclude() private readonly _username: string;
    @Exclude() private readonly _avatar: discordString;
    @Exclude() private readonly _discriminator: discordString;
    @Exclude() private readonly _publicFlags: number;
    @Exclude() private readonly _premiumType: number;
    @Exclude() private readonly _flags: number;
    @Exclude() private readonly _banner: discordString;
    @Exclude() private readonly _accentColor: number;
    @Exclude() private readonly _globalName: string;
    @Exclude() private readonly _avatarDecorationData: discordString;
    @Exclude() private readonly _bannerColor: discordString;
    @Exclude() private readonly _mfaEnabled: boolean;
    @Exclude() private readonly _locale: discordString;
    @Exclude() private readonly _email: discordString;
    @Exclude() private readonly _verified: boolean;
    @Exclude() private readonly _guilds: UserGuild[];
    @Exclude() private readonly _adminGuilds: UserGuild[];
    @Exclude() private readonly _accessToken: string;
    @Exclude() private readonly _refreshToken: string;

    constructor(user: Partial<AuthDiscordUser>) {
        this._id = user?.id;
        this._username = user?.username;
        this._avatar = user?.avatar;
        this._discriminator = user?.discriminator;
        this._publicFlags = user?.public_flags;
        this._premiumType = user?.premium_type;
        this._flags = user?.flags;
        this._banner = user?.banner;
        this._accentColor = user?.accent_color;
        this._globalName = user?.global_name;
        this._avatarDecorationData = user?.avatar_decoration_data;
        this._bannerColor = user?.banner_color;
        this._mfaEnabled = user?.mfa_enabled;
        this._locale = user?.locale;
        this._email = user?.email;
        this._verified = user?.verified;
        this._guilds = user?.guilds;
        this._adminGuilds = user?.admin_guilds;
        this._accessToken = user?.access_token;
        this._refreshToken = user?.refresh_token;
    }

    static create(user: Partial<AuthDiscordUser>) {
        return new AuthDiscordUserDto(user);
    }

    @Expose()
    get id() {
        return this._id;
    }

    @Expose()
    get username() {
        return this._username;
    }

    @Expose()
    get avatar() {
        return this._avatar;
    }

    @Expose()
    get discriminator() {
        return this._discriminator;
    }

    @Expose()
    get publicFlags() {
        return this._publicFlags;
    }

    @Expose()
    get premiumType() {
        return this._premiumType;
    }

    @Expose()
    get flags() {
        return this._flags;
    }

    @Expose()
    get banner() {
        return this._banner;
    }

    @Expose()
    get accentColor() {
        return this._accentColor;
    }

    @Expose()
    get globalName() {
        return this._globalName;
    }

    @Expose()
    get avatar_decoration_data() {
        return this._avatarDecorationData;
    }

    @Expose()
    get bannerColor() {
        return this._bannerColor;
    }

    @Expose()
    get mfa_enabled() {
        return this._mfaEnabled;
    }

    @Expose()
    get locale() {
        return this._locale;
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
    get guilds() {
        return this._guilds;
    }

    @Expose()
    get admin_guilds() {
        return this._adminGuilds;
    }

    @Expose()
    get access_token() {
        return this._accessToken;
    }

    @Expose()
    get refresh_token() {
        return this._refreshToken;
    }
}
