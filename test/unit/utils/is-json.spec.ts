// utils
import { isJson } from '@utils/index';

// ----------------------------------------------------------------------

describe('값이 Json구조인지 검사', () => {
    it(`값이 Json구조 이면 통과`, async () => {
        // Given
        const data = {
            test: 'test',
        };

        // When
        const result = isJson(data);

        // Than
        expect(result).toBeTruthy();
    });

    it(`값이 Json구조가 아니면 실패`, async () => {
        // Given
        const data1 = null;
        const data2 = undefined;
        const data3 = () => 'test';

        // When
        const result1 = isJson(data1);
        const result2 = isJson(data2);
        const result3 = isJson(data3);

        // Than
        expect(result1).not.toBeTruthy();
        expect(result2).not.toBeTruthy();
        expect(result3).not.toBeTruthy();
    });
});
