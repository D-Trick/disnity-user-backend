// types
import type {
    CFindOptions,
    CFindOneOptions,
    BulkUpdateOptions,
    InsertOptions,
    UpdateOptions,
    SelectType,
} from '@databases/types/user.type';
// lib
import { Repository } from 'typeorm';
// entities
import { User } from '@databases/entities/user.entity';
// repositories
import { CustomRepository } from '@common/modules/typeorm-custom-repository.module';
// sql
import { cFind } from './sql/find';
import { cFindOne } from './sql/find-one';
import { cInsert } from './sql/insert';
import { cUpdate } from './sql/update';
import { cBulkUpdate } from './sql/bulk-update';

// ----------------------------------------------------------------------

@CustomRepository(User)
export class UserRepository extends Repository<User> {
    /**
     * Custom Find
     * @param {CFindOptions} options
     */
    async cFind<T extends SelectType = 'basic'>(options: CFindOptions) {
        return cFind<T>(this, options);
    }

    /**
     * Custom Find One
     * @param {CFindOneOptions} options
     */
    async cFindOne<T extends SelectType = 'basic'>(options: CFindOneOptions) {
        return cFindOne<T>(this, options);
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
