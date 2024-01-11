// types
import { User, UserGuild } from '@models/discord-api/types/discordApi.type';

// ----------------------------------------------------------------------

export interface Token {
    accessToken: string;
    refreshToken: string;
}

export interface AuthUser {
    id: string;
    isLogin: boolean;
}

export interface AuthDiscordUser extends User {
    guilds: UserGuild[];
    admin_guilds: UserGuild[];

    access_token: string;
    refresh_token: string;
}
