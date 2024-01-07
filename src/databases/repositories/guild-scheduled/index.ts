// types
import type { SqlOptions } from '@common/types/sql-options.type';
import type {
    CFindOptions,
    CFindOneOptions,
    InsertOptions,
    UpdateOptions,
    DeleteOptions,
} from '@databases/types/guild-scheduled.type';
// lib
import { Repository } from 'typeorm';
// entities
import { GuildScheduled } from '@databases/entities/guild-scheduled.entity';
// repositories
import { CustomRepository } from '@common/modules/typeorm-custom-repository.module';
// sql
import { cFind } from './sql/find';
import { cFindOne } from './sql/find-one';
import { findThisMonthSchedules } from './sql/find-this-month-schedules';
import { cInsert } from './sql/insert';
import { cUpdate } from './sql/update';
import { cDelete } from './sql/delete';

// ----------------------------------------------------------------------

@CustomRepository(GuildScheduled)
export class GuildScheduledRepository extends Repository<GuildScheduled> {
    /**
     * Custom Find
     * @param {CFindOptions} options
     */
    async cFind(options: CFindOptions) {
        return cFind(this, options);
    }

    /**
     * Custom Find One
     * @param {CFindOneOptions} options
     */
    async cFindOne(options: CFindOneOptions) {
        return cFindOne(this, options);
    }

    /**
     * 이번달 길드 스케줄(이벤트)
     * @param {SqlOptions} options
     */
    async findThisMonthSchedules(options?: SqlOptions) {
        return findThisMonthSchedules(this, options);
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
