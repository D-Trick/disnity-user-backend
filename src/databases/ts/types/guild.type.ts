// entities
import { Guild } from '@databases/entities/guild.entity';

// ----------------------------------------------------------------------

/******************************
 * Select
 ******************************/
export type Select = Pick<
    Guild,
    | 'id'
    | 'name'
    | 'summary'
    | 'content'
    | 'is_markdown'
    | 'icon'
    | 'link_type'
    | 'online'
    | 'member'
    | 'premium_tier'
    | 'membership_url'
    | 'is_open'
    | 'is_admin_open'
    | 'is_bot'
    | 'invite_code'
    | 'created_at'
    | 'updated_at'
    | 'server_refresh_date'
>;
