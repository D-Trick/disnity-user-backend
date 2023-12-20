// utils
import { isBoolean } from '@utils/index';

// ----------------------------------------------------------------------

describe('값이 true, false, 1, 0인지 검사', () => {
    it(`값이 true, 1 이면 통과`, async () => {
        // Given
        const data1 = true;
        const data2 = 1;

        // When
        const result1 = isBoolean(data1);
        const result2 = isBoolean(data2);

        // Than
        expect(result1).toBeTruthy();
        expect(result2).toBeTruthy();
    });

    it(`값이 false, 0 이면 통과`, async () => {
        // Given
        const data1 = false;
        const data2 = 0;

        // When
        const result1 = isBoolean(data1);
        const result2 = isBoolean(data2);

        // Than
        expect(result1).toBeTruthy();
        expect(result2).toBeTruthy();
    });

    it(`값이 true, false, 1, 0이 아니면 실패`, async () => {
        // Given
        const data = 9;

        // When
        const result = isBoolean(data);

        // Than
        expect(result).not.toBeTruthy();
    });
});
