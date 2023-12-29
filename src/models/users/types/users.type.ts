// types
import type { Channel, UserGuild } from '@models/discord-api/types/discordApi.type';

// ----------------------------------------------------------------------

export interface AdminGuild extends UserGuild {
    channels?: Channel[];
}
