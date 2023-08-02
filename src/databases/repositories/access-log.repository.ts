// types
import type { InsertResult } from 'typeorm';
import type { InsertOptions } from '@databases/ts/interfaces/access-log.interface';
//lib
import { Repository } from 'typeorm';
import { createInsertQueryBuilder } from '@databases/utils/createQueryBuilder';
// entities
import { AccessLog } from '@databases/entities/access-log.entity';
// repositorys
import { CustomRepository } from '@common/modules/typeorm-custom-repository.module';

// ----------------------------------------------------------------------
const TABLE_ALIAS = 'access_log';
// ----------------------------------------------------------------------

@CustomRepository(AccessLog)
export class AccessLogRepository extends Repository<AccessLog> {
    /**
     * AccessLog 추가
     * @param {InsertOptions} options
     */
    async _insert(options: InsertOptions): Promise<InsertResult> {
        const { transaction, values } = options || {};

        const qb = createInsertQueryBuilder<AccessLog>(AccessLog, TABLE_ALIAS, {
            repository: this,
            transaction,
        });

        qb.into(AccessLog).values(values);

        return qb.execute();
    }
}
