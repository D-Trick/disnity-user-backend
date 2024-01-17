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
    @Exclude() private readonly _list: SearchServerList['list'];

    constructor(searchServers: SearchServerList) {
        this._totalCount = parseInt(searchServers.totalCount || '0');
        this._list = searchServers.list.map((server) => {
            server.refresh_date = dateTimeFormat(server.refresh_date);

            return server;
        });
    }

    @Expose()
    get totalCount() {
        return this._totalCount;
    }

    @Expose()
    get list() {
        return this._list;
    }
}
