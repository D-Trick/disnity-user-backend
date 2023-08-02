// lib
import { Entity, Column, PrimaryColumn, Index } from 'typeorm';

// ----------------------------------------------------------------------

@Entity('server_admin_permission')
export class ServerAdminPermission {
    @PrimaryColumn({ type: 'bigint', unsigned: true })
    id: string;

    @Index()
    @Column('bigint', { unsigned: true })
    guild_id: string;

    @Index()
    @Column('bigint', { unsigned: true })
    user_id: string;
}
