// lib
import dayjs from '@lib/dayjs';
// utils
import { timePassed } from '@utils/time-passed';

// ----------------------------------------------------------------------

describe('시간(시 or 분 or 초)만큼 지났는지 검사', () => {
    const DATE_FORMAT = 'YYYY-MM-DD HH:mm:ss';

    it(`1시간이 지나면 통과`, async () => {
        // Given
        const ago2hour = dayjs().tz().subtract(2, 'hour').format(DATE_FORMAT);

        // When
        const result = timePassed({
            dateTime: ago2hour,
            unit: 'hour',
            afterTime: 1,
        });

        // Than
        expect(Object.keys(result).length).toBe(4);
        expect(result).toHaveProperty('isTimePassed');
        expect(result).toHaveProperty('currentDateTime');
        expect(result).toHaveProperty('afterDateTime');
        expect(result).toHaveProperty('timeRemainningText');
        expect(result.isTimePassed).toBe(true);
    });

    it(`1시간이 안지나면 실패`, async () => {
        // Given
        const currentDate = dayjs().tz().format(DATE_FORMAT);

        // When
        const result = timePassed({
            dateTime: currentDate,
            unit: 'hour',
            afterTime: 1,
        });

        // Than
        expect(Object.keys(result).length).toBe(4);
        expect(result).toHaveProperty('isTimePassed');
        expect(result).toHaveProperty('currentDateTime');
        expect(result).toHaveProperty('afterDateTime');
        expect(result).toHaveProperty('timeRemainningText');
        expect(result.isTimePassed).toBe(false);
    });

    it(`1분이 지나면 통과`, async () => {
        // Given
        const ago2minute = dayjs().tz().subtract(2, 'minute').format(DATE_FORMAT);

        // When
        const result = timePassed({
            dateTime: ago2minute,
            unit: 'minute',
            afterTime: 1,
        });

        // Than
        expect(Object.keys(result).length).toBe(4);
        expect(result).toHaveProperty('isTimePassed');
        expect(result).toHaveProperty('currentDateTime');
        expect(result).toHaveProperty('afterDateTime');
        expect(result).toHaveProperty('timeRemainningText');
        expect(result.isTimePassed).toBe(true);
    });

    it(`1분이 안지나면 실패`, async () => {
        // Given
        const currentDate = dayjs().tz().format(DATE_FORMAT);

        // When
        const result = timePassed({
            dateTime: currentDate,
            unit: 'minute',
            afterTime: 1,
        });

        // Than
        expect(Object.keys(result).length).toBe(4);
        expect(result).toHaveProperty('isTimePassed');
        expect(result).toHaveProperty('currentDateTime');
        expect(result).toHaveProperty('afterDateTime');
        expect(result).toHaveProperty('timeRemainningText');
        expect(result.isTimePassed).toBe(false);
    });

    it(`1초가 지나면 통과`, async () => {
        // Given
        const ago2second = dayjs().tz().subtract(2, 'second').format(DATE_FORMAT);

        // When
        const result = timePassed({
            dateTime: ago2second,
            unit: 'second',
            afterTime: 1,
        });

        // Than
        expect(Object.keys(result).length).toBe(4);
        expect(result).toHaveProperty('isTimePassed');
        expect(result).toHaveProperty('currentDateTime');
        expect(result).toHaveProperty('afterDateTime');
        expect(result).toHaveProperty('timeRemainningText');
        expect(result.isTimePassed).toBe(true);
    });

    it(`1초가 안지나면 실패`, async () => {
        // Given
        const currentDate = dayjs().tz().format(DATE_FORMAT);

        // When
        const result = timePassed({
            dateTime: currentDate,
            unit: 'second',
            afterTime: 1,
        });

        // Than
        expect(Object.keys(result).length).toBe(4);
        expect(result).toHaveProperty('isTimePassed');
        expect(result).toHaveProperty('currentDateTime');
        expect(result).toHaveProperty('afterDateTime');
        expect(result).toHaveProperty('timeRemainningText');
        expect(result.isTimePassed).toBe(false);
    });

    it(`날짜가 없으면`, async () => {
        // Given
        const empty = '';

        // When
        const result = () =>
            timePassed({
                dateTime: empty,
                unit: 'hour',
                afterTime: 1,
            });

        // Than
        expect(result).toThrow();
    });
});
