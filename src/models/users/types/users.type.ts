// types
import type { Channel, UserGuild } from '@models/discord-api/types/discordApi.type';
// dtos
import { AuthDiscordUserDto } from '@models/auth/dtos';

// ----------------------------------------------------------------------

export interface AdminGuild extends UserGuild {
    channels?: Channel[];
}

export interface I_UsersUpdateService {
    saveLoginUser(discordUser: AuthDiscordUserDto, ip: string): Promise<boolean>;
}
