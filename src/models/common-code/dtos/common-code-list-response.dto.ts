// lib
import { Exclude, Expose } from 'class-transformer';
// entities
import { CommonCode } from '@databases/entities/common-code.entity';

// ----------------------------------------------------------------------

export class CommonCodeListResponseDto {
    @Exclude() private readonly _id: CommonCode['id'];
    @Exclude() private readonly _code: CommonCode['code'];
    @Exclude() private readonly _name: CommonCode['name'];
    @Exclude() private readonly _value: CommonCode['value'];

    constructor(commonCode: CommonCode) {
        this._id = commonCode.id;
        this._code = commonCode.code;
        this._name = commonCode.name;
        this._value = commonCode.value;
    }

    @Expose()
    get id() {
        return this._id;
    }

    @Expose()
    get code() {
        return this._code;
    }

    @Expose()
    get name() {
        return this._name;
    }

    @Expose()
    get value() {
        return this._value;
    }
}
