// types
import type { FindGuildsByIds } from '@databases/types/guild.type';
// lib
import { Exclude, Expose } from 'class-transformer';
// utils
import { dateTimeFormat } from '@utils/format-date';

// ----------------------------------------------------------------------
interface CategoryServerList {
    totalCount: string;
    categoryName: string;
    list: FindGuildsByIds['base'][];
}
// ----------------------------------------------------------------------

export class CategoryServerListResponseDto {
    @Exclude() private readonly _totalCount: number;
    @Exclude() private readonly _categoryName: CategoryServerList['categoryName'];
    @Exclude() private readonly _list: CategoryServerList['list'];

    constructor(categoryServer: CategoryServerList) {
        this._totalCount = parseInt(categoryServer.totalCount || '0');
        this._categoryName = categoryServer.categoryName;
        this._list = categoryServer.list.map((server) => {
            server.refresh_date = dateTimeFormat(server.refresh_date);

            return server;
        });
    }

    @Expose()
    get totalCount() {
        return this._totalCount;
    }

    @Expose()
    get categoryName() {
        return this._categoryName;
    }

    @Expose()
    get list() {
        return this._list;
    }
}
