// types
import type { DeleteResult, InsertResult, UpdateResult } from 'typeorm';
import type {
    FindGuildAdminsOptions,
    SelectOptions,
    InsertOptions,
    UpdateOptions,
    DeleteOptions,
} from '@databases/types/guild-admin-permission.type';
// lib
import { Repository } from 'typeorm';
// entities
import { GuildAdminPermission } from '@databases/entities/guild-admin-permission.entity';
// repositories
import { CustomRepository } from '@common/modules/typeorm-custom-repository.module';
// sql
import { selectMany, selectOne } from './sql/select';
import { findGuildAdmins } from './sql/find-guild-admins';
import { cInsert } from './sql/insert';
import { cUpdate } from './sql/update';
import { cDelete } from './sql/delete';

// ----------------------------------------------------------------------

@CustomRepository(GuildAdminPermission)
export class GuildAdminPermissionRepository extends Repository<GuildAdminPermission> {
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
     * 길드 관리자 목록 가져오기
     * @param {SelectOptions} options
     */
    async findGuildAdmins(options: FindGuildAdminsOptions): Promise<any> {
        return findGuildAdmins(this, options);
    }

    /**
     * Custom Insert
     * @param {InsertOptions} options
     */
    async cInsert(options: InsertOptions): Promise<InsertResult> {
        return cInsert(this, options);
    }

    /**
     * Custom Update
     * @param {UpdateOptions} options
     */
    async cUpdate(options: UpdateOptions): Promise<UpdateResult> {
        return cUpdate(this, options);
    }

    /**
     * Custom Delete
     * @param {DeleteOptions} options
     */
    async cDelete(options: DeleteOptions): Promise<DeleteResult> {
        return cDelete(this, options);
    }
}
