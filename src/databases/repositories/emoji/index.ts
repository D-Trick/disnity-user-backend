// types
import type { SelectOptions, InsertOptions, UpdateOptions, DeleteOptions } from '@databases/types/emoji.type';
// lib
import { Repository } from 'typeorm';
// entities
import { Emoji } from '@databases/entities/emoji.entity';
// repositories
import { CustomRepository } from '@common/modules/typeorm-custom-repository.module';
// sql
import { selectOne, selectMany } from './sql/select';
import { cInsert } from './sql/insert';
import { cUpdate } from './sql/update';
import { cDelete } from './sql/delete';

// ----------------------------------------------------------------------

@CustomRepository(Emoji)
export class EmojiRepository extends Repository<Emoji> {
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
