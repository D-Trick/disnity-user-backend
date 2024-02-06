// utils
import { dateFormat, dateTimeFormat } from '@utils/index';

// ----------------------------------------------------------------------

describe('format date 테스트', () => {
    it(`년-월-일로 형태로 반환한다.`, async () => {
        // Given
        const dt = '2024-01-01 11:12:13';

        // When
        const date = dateFormat(dt);

        // Than
        expect(date).toBe('2024-01-01');
    });

    it(`년-월-일 시:분:초 형태로 반환한다.`, async () => {
        // Given
        const dt = '2024-01-01 11:12:13';

        // When
        const dateTime = dateTimeFormat(dt);

        // Than
        expect(dateTime).toBe('2024-01-01 11:12:13');
    });

    it(`값이 날짜 형태가 아니면 빈문자열을 반환한다.`, async () => {
        // Given
        const dt1 = 'asdasdasd';
        const dt2 = '';

        // When
        const date1 = dateFormat(dt1);
        const dateTime1 = dateTimeFormat(dt1);
        const date2 = dateFormat(dt2);
        const dateTime2 = dateTimeFormat(dt2);

        // Than
        expect(date1).toBe('');
        expect(dateTime1).toBe('');
        expect(date2).toBe('');
        expect(dateTime2).toBe('');
    });
});
