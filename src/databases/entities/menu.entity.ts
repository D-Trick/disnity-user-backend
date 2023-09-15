// types
import type { DataTypeBoolean } from '@databases/types/global';
// lib
import { Entity, Column, PrimaryColumn } from 'typeorm';

// ----------------------------------------------------------------------

@Entity('menu')
export class Menu {
    @PrimaryColumn({ type: 'smallint', unsigned: true })
    id: number;

    @Column('varchar', { length: 20 })
    type: string;

    @Column('varchar', { length: 30 })
    name: string;

    @Column('varchar', { length: 250, nullable: true })
    path?: string;

    @Column('varchar', { length: 255, nullable: true })
    icon?: string;

    @Column('varchar', { length: 255, nullable: true })
    caption?: string;

    @Column('tinyint', { width: 1, default: 0 })
    disabled: DataTypeBoolean;

    @Column('smallint', { nullable: true })
    parent_id?: number;

    @Column('tinyint')
    depth: number;

    @Column('smallint')
    sort: number;
}
