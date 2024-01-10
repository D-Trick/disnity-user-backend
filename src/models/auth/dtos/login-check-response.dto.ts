// lib
import { Exclude, Expose } from 'class-transformer';

// ----------------------------------------------------------------------

export class LoginCheckResponseDto {
    @Exclude() private readonly _result: boolean;

    constructor(result: boolean) {
        this._result = result;
    }

    @Expose()
    get result() {
        return this._result;
    }
}
