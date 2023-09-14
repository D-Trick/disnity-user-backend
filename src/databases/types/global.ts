export type Sort = 'ASC' | 'DESC';

export type SelectBooleanified<T> = {
    [K in keyof T]?: boolean;
};

export interface Count {
    count: string;
}

/******************************
 * Data Type
 ******************************/
export type DataTypeDate = string | Date | (() => string);
export type DataTypeBoolean = boolean | 1 | 0;
