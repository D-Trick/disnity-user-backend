import { Entity, Column, PrimaryColumn } from 'typeorm';

// ----------------------------------------------------------------------

@Entity('tag')
export class Tag {
    @PrimaryColumn({ type: 'bigint', unsigned: true })
    id: string;

    @Column('bigint', { unsigned: true })
    guild_id: string;

    @Column('varchar', { length: 10 })
    name: string;
}
