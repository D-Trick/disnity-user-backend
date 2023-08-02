// types
import type { Channel, User, UserGuild } from '@models/discord-api/ts/interfaces/discordApi.interface';
// entities
import { User as UserEntity } from '@databases/entities/user.entity';

// ----------------------------------------------------------------------

export interface DiscordLoginUser extends User {
    guilds: UserGuild[];
    admin_guilds: UserGuild[];

    access_token: string;
    refresh_token: string;
}

export interface CacheUser extends UserEntity {
    guilds: UserGuild[];
    admin_guilds?: AdminGuild[];

    access_token: string;
    refresh_token: string;
}

export interface LoginUserSave extends DiscordLoginUser {
    ip: string;
}

export interface AdminGuild extends UserGuild {
    channels?: Channel[];
}
