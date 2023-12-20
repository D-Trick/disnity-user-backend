// types
import type { ConfigType } from 'dayjs';
// lib
import dayjs from '@lib/dayjs';
// ----------------------------------------------------------------------
interface TimePassed {
    isTimePassed: boolean;
    currentDateTime: string;
    afterDateTime: string;
}
interface Options {
    dateTime: ConfigType;
    unit: 'hour' | 'minute' | 'second';
    afterTime: number;
}
// ----------------------------------------------------------------------
const DATE_FORMAT = 'YYYY-MM-DD HH:mm:ss';
// ----------------------------------------------------------------------

/**
 * 시간(시 or 분 or 초)만큼 지났는지 검사
 * @param {TimeOption} options
 */
export function timePassed({ dateTime, unit, afterTime }: Options): TimePassed {
    if (!dateTime) {
        throw new Error('dateTime이 없습니다.');
    }

    const currentDateTime = dayjs().tz().format(DATE_FORMAT);

    let afterDateTime = currentDateTime;
    const compareDayjs = dayjs(dateTime).tz();
    if (unit === 'hour') {
        afterDateTime = compareDayjs.add(afterTime, 'hour').format(DATE_FORMAT);
    }

    if (unit === 'minute') {
        afterDateTime = compareDayjs.add(afterTime, 'minute').format(DATE_FORMAT);
    }

    if (unit === 'second') {
        afterDateTime = compareDayjs.add(afterTime, 'second').format(DATE_FORMAT);
    }

    return {
        isTimePassed: currentDateTime > afterDateTime,
        currentDateTime,
        afterDateTime,
    };
}
