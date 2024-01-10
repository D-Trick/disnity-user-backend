// lib
import { Exclude, Expose } from 'class-transformer';
// entities
import { Guild } from '@databases/entities/guild.entity';

// ----------------------------------------------------------------------

export class SaveResultResponseDto {
    @Exclude() private readonly _id: string;

    constructor(serverId: Guild['id']) {
        this._id = serverId;
    }

    @Expose()
    get id() {
        return this._id;
    }
}
