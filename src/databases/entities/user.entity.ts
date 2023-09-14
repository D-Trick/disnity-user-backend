// types
import { DataTypeBoolean, DataTypeDate } from '@databases/types/global';
// lib
import { Entity, Column, PrimaryColumn } from 'typeorm';

// ----------------------------------------------------------------------

@Entity('user')
export class User {
    @PrimaryColumn({ type: 'bigint', unsigned: true })
    id: string;

    @Column('varchar', { length: 32, nullable: true })
    global_name?: string;

    @Column('varchar', { length: 32 })
    username: string;

    @Column('varchar', { length: 4 })
    discriminator: string;

    @Column('varchar', { length: 255, nullable: true })
    email?: string;

    @Column('tinyint', { width: 1, default: 0 })
    verified?: DataTypeBoolean;

    @Column('varchar', { length: 1000, nullable: true })
    avatar?: string;

    @Column('varchar', { length: 1000, nullable: true })
    banner?: string;

    @Column('varchar', { length: 10, nullable: true })
    locale?: string;

    @Column('int', { nullable: true })
    premium_type?: number;

    @Column('timestamp', { nullable: true })
    created_at?: DataTypeDate;

    @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
    updated_at?: DataTypeDate;
}
