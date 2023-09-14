// types
import type { DataTypeBoolean } from '@databases/types/global';
// lib
import { Entity, Column, PrimaryColumn, Index } from 'typeorm';

// ----------------------------------------------------------------------

@Entity('emoji')
export class Emoji {
    @PrimaryColumn({ type: 'bigint', unsigned: true })
    id: string;

    @Column('bigint', { unsigned: true })
    @Index('ix_guild_id')
    guild_id: string;

    @Column('varchar', { length: 255, nullable: true })
    name?: string;

    @Column('tinyint', { width: 1 })
    animated: DataTypeBoolean;
}
