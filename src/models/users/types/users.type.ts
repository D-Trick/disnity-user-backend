// types
import type { Channel, User, UserGuild } from '@models/discord-api/types/discordApi.type';

// ----------------------------------------------------------------------

export interface AdminGuild extends UserGuild {
    channels?: Channel[];
}

export interface DiscordLoginUser extends User {
    guilds: UserGuild[];
    admin_guilds: UserGuild[];

    access_token: string;
    refresh_token: string;
}

export interface SaveLoginInfo extends DiscordLoginUser {
    ip: string;
}
