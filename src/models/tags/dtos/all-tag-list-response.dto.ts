// types
import type { FindAllTags } from '@databases/types/tag.type';
// lib
import { Exclude, Expose } from 'class-transformer';

// ----------------------------------------------------------------------

export class AllTagListResponseDto {
    @Exclude() private readonly _name: FindAllTags['name'];
    @Exclude() private readonly _total: number;

    constructor(tag: FindAllTags) {
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
