import { Entity, Column, PrimaryColumn, Index } from 'typeorm';

// ----------------------------------------------------------------------

@Entity('tag')
export class Tag {
    @PrimaryColumn({ type: 'bigint', unsigned: true })
    id: string;

    @Column('bigint', { unsigned: true })
    @Index('ix_guild_id')
    guild_id: string;

    @Column('varchar', { length: 10 })
    name: string;

    @Column('tinyint', { default: 0 })
    sort: number;
}
