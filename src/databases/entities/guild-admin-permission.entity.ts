// types
import { DataTypeBoolean } from '@databases/types/global';
// lib
import { Entity, Column, PrimaryColumn, Index } from 'typeorm';

// ----------------------------------------------------------------------

@Entity('guild_admin_permission')
export class GuildAdminPermission {
    @PrimaryColumn({ type: 'bigint', unsigned: true })
    id: string;

    @Column('bigint', { unsigned: true })
    @Index('ix_guild_id')
    guild_id: string;

    @Column('bigint', { unsigned: true })
    @Index('ix_user_id')
    user_id: string;

    @Column('tinyint', { width: 1, default: 0 })
    is_owner?: DataTypeBoolean;
}
