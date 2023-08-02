// types
import type { ServerAdminPermission } from '@databases/entities/server-admin-permission.entity';

// ----------------------------------------------------------------------

/******************************
 * Select
 ******************************/
export type Select = Pick<ServerAdminPermission, 'id' | 'guild_id' | 'user_id'>;
