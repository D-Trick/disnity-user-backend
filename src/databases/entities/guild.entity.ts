// types
import type { DataTypeBoolean, DataTypeDate } from '@databases/ts/types/global';
// lib
import { Entity, Column, PrimaryColumn } from 'typeorm';

// ----------------------------------------------------------------------

@Entity('guild')
export class Guild {
    @PrimaryColumn({ type: 'bigint', unsigned: true })
    id: string;

    @PrimaryColumn({ type: 'bigint', unsigned: true })
    user_id: string;

    @Column('smallint', { unsigned: true })
    category_id: number;

    @Column('varchar', { length: 100 })
    name: string;

    @Column('varchar', { length: 250, nullable: true })
    summary?: string;

    @Column('text', { nullable: true })
    content?: string;

    @Column('tinyint', { width: 1 })
    is_markdown: DataTypeBoolean;

    @Column('varchar', { length: 1000, nullable: true })
    icon?: string;

    @Column('varchar', { length: 1000, nullable: true })
    banner?: string;

    @Column('varchar', { length: 1000, nullable: true })
    splash?: string;

    @Column('int', { default: 0 })
    online?: number;

    @Column('int', { default: 0 })
    member?: number;

    @Column('tinyint', { nullable: true })
    premium_tier?: number;

    @Column('varchar', { length: 20, nullable: true })
    link_type?: string;

    @Column('varchar', { length: 50, nullable: true })
    invite_code?: string;

    @Column('varchar', { length: 2048, nullable: true })
    membership_url?: string;

    @Column('tinyint', { width: 1 })
    is_bot: DataTypeBoolean;

    @Column('tinyint', { width: 1 })
    is_open: DataTypeBoolean;

    @Column('tinyint', { width: 1, default: 1 })
    is_admin_open?: DataTypeBoolean;

    @Column('varchar', { length: 250, nullable: true })
    private_reason?: string;

    @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
    created_at?: DataTypeDate;

    @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
    updated_at?: DataTypeDate;

    @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
    server_refresh_date?: DataTypeDate;
}
