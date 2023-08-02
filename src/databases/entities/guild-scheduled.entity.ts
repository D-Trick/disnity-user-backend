// types
import type { DataTypeDate } from '@databases/ts/types/global';
// lib
import { Entity, Column, PrimaryColumn } from 'typeorm';

// ----------------------------------------------------------------------

@Entity('guild_scheduled')
export class GuildScheduled {
    @PrimaryColumn({ type: 'bigint', unsigned: true })
    id: string;

    @PrimaryColumn({ type: 'bigint', unsigned: true })
    guild_id: string;

    @Column('bigint', { nullable: true, unsigned: true })
    channel_id?: string;

    @Column('bigint', { nullable: true, unsigned: true })
    creator_id?: string;

    @Column('varchar', { length: 100, nullable: true })
    name?: string;

    @Column('varchar', { length: 1000, nullable: true })
    description?: string;

    @Column('timestamp', { nullable: true })
    scheduled_start_time?: DataTypeDate;

    @Column('timestamp', { nullable: true })
    scheduled_end_time?: DataTypeDate;

    @Column('tinyint', { nullable: true })
    privacy_level?: number;

    @Column('tinyint', { nullable: true })
    status?: number;

    @Column('tinyint', { nullable: true })
    entity_type?: number;

    @Column('bigint', { unsigned: true })
    entity_id?: string;

    @Column('varchar', { length: 100, nullable: true })
    entity_metadata?: string;

    @Column('int', { default: 0 })
    user_count?: number;

    @Column('varchar', { length: 1000, nullable: true })
    image?: string;
}
