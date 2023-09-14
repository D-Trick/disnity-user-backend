// types
import type { InsertOptions } from '@databases/types/access-log.type';
// lib
import { Repository } from 'typeorm';
// entities
import { AccessLog } from '@databases/entities/access-log.entity';
// repositories
import { CustomRepository } from '@common/modules/typeorm-custom-repository.module';
// sql
import { cInsert } from './sql/insert';

// ----------------------------------------------------------------------

@CustomRepository(AccessLog)
export class AccessLogRepository extends Repository<AccessLog> {
    /**
     * Custom Insert
     * @param {InsertOptions} options
     */
    async cInsert(options: InsertOptions) {
        return cInsert(this, options);
    }
}
