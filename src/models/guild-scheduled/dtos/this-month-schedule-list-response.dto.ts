// types
import type { FindThisMonthSchedules } from '@databases/types/guild-scheduled.type';
// lib
import { Exclude, Expose } from 'class-transformer';
// utils
import { dateTimeFormat } from '@utils/format-date';
// entities
import { Guild } from '@databases/entities/guild.entity';
import { GuildScheduled } from '@databases/entities/guild-scheduled.entity';

// ----------------------------------------------------------------------

export class ThisMonthScheduleListResponseDto {
    @Exclude() private readonly _id: GuildScheduled['id'];
    @Exclude() private readonly _guild_id: Guild['id'];
    @Exclude() private readonly _guild_name: Guild['name'];
    @Exclude() private readonly _guild_icon: Guild['icon'];
    @Exclude() private readonly _name: GuildScheduled['name'];
    @Exclude() private readonly _image: GuildScheduled['image'];
    @Exclude() private readonly _description: GuildScheduled['description'];
    @Exclude() private readonly _scheduled_start_time: string;
    @Exclude() private readonly _scheduled_end_time: string;

    constructor(schedule: FindThisMonthSchedules) {
        this._id = schedule.id;
        this._guild_id = schedule.guild_id;
        this._guild_name = schedule.guild_name;
        this._guild_icon = schedule.guild_icon;
        this._name = schedule.name;
        this._image = schedule.image;
        this._description = schedule.description;
        this._scheduled_start_time = dateTimeFormat(schedule.scheduled_start_time);
        this._scheduled_end_time = dateTimeFormat(schedule.scheduled_end_time);
    }

    @Expose()
    get id() {
        return this._id;
    }

    @Expose()
    get guild_id() {
        return this._guild_id;
    }

    @Expose()
    get guild_name() {
        return this._guild_name;
    }

    @Expose()
    get guild_icon() {
        return this._guild_icon;
    }

    @Expose()
    get name() {
        return this._name;
    }

    @Expose()
    get image() {
        return this._image;
    }

    @Expose()
    get description() {
        return this._description;
    }

    @Expose()
    get scheduled_start_time() {
        return this._scheduled_start_time;
    }

    @Expose()
    get scheduled_end_tim() {
        return this._scheduled_end_time;
    }
}
