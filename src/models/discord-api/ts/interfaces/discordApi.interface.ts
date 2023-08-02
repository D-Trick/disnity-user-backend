// types
import type { snowflake, discordString, discordTimeStamp } from '../types/discordApi.type';

// ----------------------------------------------------------------------

// users
export interface User {
    id?: snowflake;
    global_name?: string;
    username?: string;
    discriminator?: discordString;
    avatar?: discordString;
    bot?: boolean;
    system?: boolean;
    mfa_enabled?: boolean;
    banner?: discordString;
    accent_color?: number;
    locale?: discordString;
    verified?: boolean;
    email?: discordString;
    flags?: number;
    premium_type?: number;
    public_flags?: number;
}
export interface UserGuild {
    id: snowflake;
    name: discordString;
    icon: discordString;
    owner: boolean;
    permissions: number;
    features: string[];
    permissions_new: discordString;
}

// Guilds
interface ThreadMetadata {
    archived: boolean;
    auto_archive_duration: number;
    archive_timestamp: number | Date;
    locked: boolean;
    invitable: boolean;
    create_timestamp: number | Date;
}

interface ForumTag {
    id: snowflake;
    name: discordString;
    moderated: boolean;
    emoji_id: snowflake;
    emoji_name: discordString;
}

interface DefaultReactionEmoji {
    emoji_id: snowflake;
    emoji_name: discordString;
}

interface GuildMember {
    user: User[];
    nick: discordString;
    avatar: discordString;
    roles: string[];
    joined_at: number | Date;
    premium_since: number | Date;
    deaf: boolean;
    mute: boolean;
    pending: boolean;
    permissions: number;
    communication_disabled_until: number | Date;
}

interface ThreadMember {
    id: snowflake;
    user_id: snowflake;
    join_timestamp: number | Date;
    flags: number;
    member: GuildMember[];
}

interface WelcomeScreen {
    description: discordString;
    welcome_channels: WelcomeScreenChannel[];
}

interface WelcomeScreenChannel {
    channel_id: snowflake;
    description: discordString;
    emoji_id: snowflake;
    emoji_name: discordString;
}

export interface Guild {
    id?: snowflake;
    name?: discordString;
    icon?: discordString;
    icon_hash?: discordString;
    splash?: discordString;
    discovery_splash?: discordString;
    owner?: boolean;
    owner_id?: snowflake;
    permissions?: number;
    region?: discordString;
    afk_channel_id?: snowflake;
    afk_timeout?: number;
    widget_enabled?: boolean;
    widget_channel_id?: snowflake;
    verification_level?: number;
    default_message_notifications?: number;
    explicit_content_filter?: number;
    roles?: Role[];
    emojis?: Emoji[];
    features?: string[];
    mfa_level?: number;
    application_id?: snowflake;
    system_channel_id?: snowflake;
    system_channel_flags?: number;
    rules_channel_id?: snowflake;
    max_presences?: number;
    max_members?: number;
    vanity_url_code?: discordString;
    description?: discordString;
    banner?: discordString;
    premium_tier?: number;
    premium_subscription_count?: number;
    preferred_locale?: discordString;
    public_updates_channel_id?: snowflake;
    max_video_channel_users?: number;
    approximate_member_count?: number;
    approximate_presence_count?: number;
    welcome_screen?: WelcomeScreen;
    nsfw_level?: number;
    stickers?: Sticker[];
    premium_progress_bar_enabled?: boolean;
}

// Permission
export interface PermissionOverwrite {
    id: snowflake;
    type: number;
    allow: number;
    deny: number;
    allow_new: discordString;
    deny_new: discordString;
}

// Role
interface RoleTag {
    bot_id: snowflake;
    integration_id: snowflake;
    premium_subscriber: null;
    subscription_listing_id: snowflake;
    available_for_purchase: null;
    guild_connections: null;
}
export interface Role {
    id: snowflake;
    name: discordString;
    color: number;
    hoist: boolean;
    icon: discordString;
    unicode_emoji: discordString;
    position: number;
    permissions: number;
    managed: boolean;
    mentionable: boolean;
    tags: RoleTag;
}

// Emojis
export interface Emoji {
    id: snowflake;
    name: discordString;
    roles: Role[];
    user: User[];
    require_colons: boolean;
    managed: boolean;
    animated: boolean;
    available: boolean;
}

// Stickers
export interface Sticker {
    id: snowflake;
    pack_id: snowflake;
    name: discordString;
    description: discordString;
    tags: discordString;
    asset: discordString;
    type: number;
    format_type: number;
    available: boolean;
    guild_id: snowflake;
    user: User;
    sort_value: number;
}

// Channel
export interface Channel {
    id: snowflake;
    type: number;
    guild_id: snowflake;
    position: number;
    permission_overwrites: PermissionOverwrite[];
    name: discordString;
    topic: discordString;
    nsfw: boolean;
    last_message_id: snowflake;
    bitrate: number;
    user_limit: number;
    rate_limit_per_user: number;
    recipients: User[];
    icon: discordString;
    owner_id: snowflake;
    application_id: snowflake;
    parent_id: snowflake;
    last_pin_timestamp: number | discordString;
    rtc_region: discordString;
    video_quality_mode: number;
    message_count: number;
    member_count: number;
    thread_metadata: ThreadMetadata[];
    member: ThreadMember[];
    default_auto_archive_duration: number;
    permissions: number;
    flags: number;
    total_message_sent: number;
    available_tags: ForumTag[];
    applied_tags: string[];
    default_reaction_emoji: DefaultReactionEmoji[];
    default_thread_rate_limit_per_user: number;
    default_sort_order: number;
    default_forum_layout: number;
}

// Invite
interface InviteStageInstance {
    members: GuildMember[];
    participant_count: number;
    speaker_count: number;
    topic: discordString;
}

export interface Invite {
    code: discordString;
    guild: Guild;
    channel: Channel[];
    inviter: User;
    target_type: number;
    target_user: User;
    target_application: Application;
    approximate_presence_count: number;
    approximate_member_count: number;
    expires_at: discordTimeStamp;
    stage_instance: InviteStageInstance;
    guild_scheduled_event: GuildScheduledEvent;
}

// Application
interface Team {
    icon: discordString;
    id: snowflake;
    members: TeamMember[];
    name: discordString;
    owner_user_id: snowflake;
}

interface TeamMember {
    membership_state: number;
    permissions: string[];
    team_id: snowflake;
    user: User;
}

export interface Application {
    id: snowflake;
    name: discordString;
    icon: discordString;
    description: discordString;
    rpc_origins: string[];
    bot_public: boolean;
    bot_require_code_grant: boolean;
    terms_of_service_url: discordString;
    privacy_policy_url: discordString;
    owner: User;
    verify_key: discordString;
    team: Team;
    guild_id: snowflake;
    primary_sku_id: snowflake;
    slug: discordString;
    cover_image: discordString;
    flags: number;
    tags: string[];
    install_params: string[];
    custom_install_url: discordString;
    role_connections_verification_url: discordString;
}

// Guild Scheduled Event
interface EntityMetadata {
    location: discordString;
}

export interface GuildScheduledEvent {
    id: snowflake;
    guild_id: snowflake;
    channel_id: snowflake;
    creator_id: snowflake;
    name: discordString;
    description: discordString;
    scheduled_start_time: discordTimeStamp;
    scheduled_end_time: discordTimeStamp;
    privacy_level: 2;
    status: 1 | 2 | 3 | 4;
    entity_type: 1 | 2 | 3;
    entity_id: snowflake;
    entity_metadata: EntityMetadata;
    creator: User;
    user_count: number;
    image: discordString;
}
