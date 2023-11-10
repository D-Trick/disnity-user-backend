// types
import type { SqlOptions } from '@common/types/sql-options.type';
import type { SelectOptions, InsertOptions, UpdateOptions, DeleteOptions } from '@databases/types/guild-scheduled.type';
// lib
import { Repository } from 'typeorm';
// entities
import { GuildScheduled } from '@databases/entities/guild-scheduled.entity';
// repositories
import { CustomRepository } from '@common/modules/typeorm-custom-repository.module';
// sql
import { selectMany, selectOne } from './sql/select';
import { findThisMonthScheduled } from './sql/find-this-month-scheduled';
import { cInsert } from './sql/insert';
import { cUpdate } from './sql/update';
import { cDelete } from './sql/delete';

// ----------------------------------------------------------------------

@CustomRepository(GuildScheduled)
export class GuildScheduledRepository extends Repository<GuildScheduled> {
    /**
     * Select One
     * @param {SelectOptions} options
     */
    async selectOne(options: SelectOptions) {
        return selectOne(this, options);
    }

    /**
     * Select Many
     * @param {SelectOptions} options
     */
    async selectMany(options: SelectOptions) {
        return selectMany(this, options);
    }

    /**
     * 이번달 길드 스케줄(이벤트)
     * @param {SqlOptions} options
     */
    async findThisMonthScheduled(options?: SqlOptions) {
        return findThisMonthScheduled(this, options);
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
     * Custom Delete
     * @param {DeleteOptions} options
     */
    async cDelete(options: DeleteOptions) {
        return cDelete(this, options);
    }
}
