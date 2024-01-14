// types
import type { FindGuildsByIds } from '@databases/types/guild.type';
// lib
import { Exclude, Expose } from 'class-transformer';
// utils
import { dateTimeFormat } from '@utils/format-date';

// ----------------------------------------------------------------------
interface MyServerList {
    totalCount: string;
    list: FindGuildsByIds['myGuild'][];
}
// ----------------------------------------------------------------------

export class MyServerListResponseDto {
    @Exclude() private readonly _totalCount: number;
    @Exclude() private readonly _list: MyServerList['list'];

    constructor(myServers: MyServerList) {
        this._totalCount = parseInt(myServers.totalCount || '0');
        this._list = myServers.list.map((server) => {
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
