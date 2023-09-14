// types
import type {
    BulkUpdateOptions,
    SelectOptions,
    InsertOptions,
    UpdateOptions,
    SelectSqlName,
} from '@databases/types/user.type';
// lib
import { Repository } from 'typeorm';
// entities
import { User } from '@databases/entities/user.entity';
// repositories
import { CustomRepository } from '@common/modules/typeorm-custom-repository.module';
// sql
import { selectMany, selectOne } from './sql/select';
import { cInsert } from './sql/insert';
import { cUpdate } from './sql/update';
import { cBulkUpdate } from './sql/bulk-update';

// ----------------------------------------------------------------------

@CustomRepository(User)
export class UserRepository extends Repository<User> {
    /**
     * Select One
     * @param {SelectOptions} options
     */
    async selectOne<T extends SelectSqlName = 'columns'>(options: SelectOptions) {
        return selectOne<T>(this, options);
    }
    /**
     * Select Many
     * @param {SelectOptions} options
     */
    async selectMany<T extends SelectSqlName = 'columns'>(options: SelectOptions) {
        return selectMany<T>(this, options);
    }

    /**
     * Custom Insert
     * @param {InsertOptions} options
     */
    async cInsert(options: InsertOptions) {
        return cInsert(this, options);
    }

    /**
     * Custom Update
     * @param {UpdateOptions} options
     */
    async cUpdate(options: UpdateOptions) {
        return cUpdate(this, options);
    }

    /**
     * Custom Bulk Update
     * @param {BulkUpdateOptions} options
     */
    async cBulkUpdate(options: BulkUpdateOptions) {
        return cBulkUpdate(this, options);
    }
}
