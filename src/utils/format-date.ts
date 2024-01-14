import dayjs from '@lib/dayjs';

// ----------------------------------------------------------------------
const INVALID_DATE = 'Invalid Date';
// ----------------------------------------------------------------------

export function dateFormat(value: any) {
    if (!value) {
        return '';
    }

    const date = dayjs(value).format('YYYY-MM-DD');
    if (date === INVALID_DATE) {
        return '';
    }

    return date;
}

export function dateTimeFormat(value: any) {
    if (!value) {
        return '';
    }

    const dateTime = dayjs(value).format('YYYY-MM-DD HH:mm:ss');
    if (dateTime === INVALID_DATE) {
        return '';
    }

    return dateTime;
}
