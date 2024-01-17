// types
import type { FindGuildsByIds } from '@databases/types/guild.type';
// lib
import { Exclude, Expose } from 'class-transformer';
// utils
import { dateTimeFormat } from '@utils/format-date';

// ----------------------------------------------------------------------
interface SearchServerList {
    totalCount: string;
    keyword: string;
    list: FindGuildsByIds['base'][];
}
// ----------------------------------------------------------------------

export class SearchServerListResponseDto {
    @Exclude() private readonly _totalCount: number;
    @Exclude() private readonly _keyword: string;
    @Exclude() private readonly _list: SearchServerList['list'];

    constructor(searchServer: SearchServerList) {
        this._totalCount = parseInt(searchServer.totalCount || '0');
        this._keyword = searchServer.keyword;
        this._list = searchServer.list.map((server) => {
            server.refresh_date = dateTimeFormat(server.refresh_date);

            return server;
        });
    }

    @Expose()
    get totalCount() {
        return this._totalCount;
    }

    @Expose()
    get keyword() {
        return this._keyword;
    }

    @Expose()
    get list() {
        return this._list;
    }
}
