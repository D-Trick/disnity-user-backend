// types
import type { DataTypeDate } from '@databases/ts/types/global';
// lib
import { Entity, Column, PrimaryColumn } from 'typeorm';

// ----------------------------------------------------------------------

@Entity('access_log')
export class AccessLog {
    @PrimaryColumn({ type: 'bigint', unsigned: true })
    id: string;

    @Column({ type: 'bigint', unsigned: true })
    user_id: string;

    @Column('varchar', { length: 15, nullable: true })
    ip?: string;

    @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
    created_at?: DataTypeDate;
}
