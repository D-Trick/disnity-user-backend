// types
import type { DataTypeDate } from '@databases/types/global';
// lib
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
// utils
import { LocalDateTimeTransformer } from '@databases/utils/transformers/local-date-time.transformer';

// ----------------------------------------------------------------------

@Entity('common_code')
export class CommonCode {
    @PrimaryGeneratedColumn({ type: 'integer' })
    id?: number;

    @Column('varchar', { length: 20 })
    code: string;

    @Column('varchar', { length: 20, nullable: true })
    value?: string;

    @Column('varchar', { length: 50 })
    name: string;

    @Column('timestamp', {
        default: () => 'CURRENT_TIMESTAMP',
        transformer: new LocalDateTimeTransformer(),
    })
    created_at?: DataTypeDate;

    @Column('bigint', { unsigned: true })
    created_admin_id: string;

    @Column('timestamp', {
        default: () => 'CURRENT_TIMESTAMP',
        transformer: new LocalDateTimeTransformer(),
    })
    updated_at?: DataTypeDate;

    @Column('bigint', { unsigned: true })
    updated_admin_id: string;
}
