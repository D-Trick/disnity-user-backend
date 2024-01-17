// types
import type { DataTypeDate } from '@databases/types/global';
// lib
import { Entity, Column, PrimaryColumn, Index } from 'typeorm';
// utils
import { LocalDateTimeTransformer } from '@utils/database/transformers/local-date-time.transformer';

// ----------------------------------------------------------------------

@Entity('access_log')
export class AccessLog {
    @PrimaryColumn({ type: 'bigint', unsigned: true })
    id: string;

    @Column({ type: 'bigint', unsigned: true })
    @Index('ix_user_id')
    user_id: string;

    @Column('varchar', { length: 15, nullable: true })
    ip?: string;

    @Column('timestamp', {
        default: () => 'CURRENT_TIMESTAMP',
        transformer: new LocalDateTimeTransformer(),
    })
    created_at?: DataTypeDate;
}
