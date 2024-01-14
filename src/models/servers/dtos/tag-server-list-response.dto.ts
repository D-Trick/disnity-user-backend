// types
import type { FindGuildsByIds } from '@databases/types/guild.type';
// lib
import { Exclude, Expose } from 'class-transformer';
// utils
import { dateTimeFormat } from '@utils/format-date';

// ----------------------------------------------------------------------
interface TagServerList {
    totalCount: string;
    tagName: string;
    list: FindGuildsByIds['base'][];
}
// ----------------------------------------------------------------------

export class TagServerListResponseDto {
    @Exclude() private readonly _totalCount: number;
    @Exclude() private readonly _list: TagServerList['list'];

    constructor(tagServers: TagServerList) {
        this._totalCount = parseInt(tagServers.totalCount || '0');
        this._list = tagServers.list.map((server) => {
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
