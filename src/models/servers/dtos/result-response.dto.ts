// lib
import { Exclude, Expose } from 'class-transformer';

// ----------------------------------------------------------------------

export class ResultResponseDto {
    @Exclude() private readonly _result: boolean;

    constructor(result: boolean) {
        this._result = result || false;
    }

    @Expose()
    get result() {
        return this._result;
    }
}
