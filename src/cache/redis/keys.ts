export const CACHE_KEYS = {
    DISNITY_USER: (userId: string) => `disnity-user-${userId}`,
    DISCORD_USER: (userId: string) => `discord-user-${userId}`,
    DISNITY_BOT_ADMINS: (guildId: string) => `disnity-bot-${guildId}-admins`,
    MENUES: (type: string) => `menues-${type}`,
};
