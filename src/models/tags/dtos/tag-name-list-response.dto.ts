// types
import type { FindNames } from '@databases/types/tag.type';
// lib
import { Exclude, Expose } from 'class-transformer';

// ----------------------------------------------------------------------

export class TagNameListResponseDto {
    @Exclude() private readonly _name: FindNames['name'];
    @Exclude() private readonly _total: number;

    constructor(tag: FindNames) {
        this._name = tag.name;
        this._total = parseInt(tag.total || '0');
    }

    @Expose()
    get name() {
        return this._name;
    }

    @Expose()
    get total() {
        return this._total;
    }
}
