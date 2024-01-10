// types
import type { ReturnFindGuildsByIds } from '@databases/types/guild.type';
// lib
import { Exclude, Expose } from 'class-transformer';
import dayjs from '@lib/dayjs';

// ----------------------------------------------------------------------
interface MyServerList {
    totalCount: string;
    list: ReturnFindGuildsByIds['myGuild'][];
}
// ----------------------------------------------------------------------

export class MyServerListResponseDto {
    @Exclude() private readonly _totalCount: number;
    @Exclude() private readonly _list: MyServerList['list'];

    constructor(myServers: MyServerList) {
        this._totalCount = parseInt(myServers.totalCount || '0');
        this._list = myServers.list.map((server) => {
            server.refresh_date = this.dateTimeFormat(server.refresh_date);

            return server;
        });
    }

    private dateTimeFormat(timestamp: any) {
        if (timestamp) {
            return dayjs(timestamp).format('YYYY-MM-DD HH:mm:ss');
        }

        return timestamp;
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
