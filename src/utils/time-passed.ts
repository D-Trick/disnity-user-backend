// types
import type { ConfigType } from 'dayjs';

// lib
import dayjs from '@lib/dayjs';
/**************************************************/
interface TimePassed {
    isTimePassed: boolean;
    currentDate: string;
    compareDate: string;
}
/**************************************************/
const DATE_FORMAT = 'YYYY-MM-DD HH:mm:ss';

/**
 * 비교날짜 기준으로 지정한 시간만큼 지났는지 검사
 * @param {ConfigType} compareDate
 * @param {number} second
 * @returns 시간경과 정보
 */
export function timePassed(compareDate: ConfigType, second: number): TimePassed {
    if (!compareDate) throw new Error('비교해야될 날짜가 없습니다.');

    const currentDate = dayjs().tz().format(DATE_FORMAT);
    const date = dayjs(compareDate).add(second, 'second').tz().format(DATE_FORMAT);

    return {
        isTimePassed: currentDate > date,
        currentDate,
        compareDate: date,
    };
}
