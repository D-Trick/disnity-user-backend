// utils
import { isNotJson } from '@utils/index';

// ----------------------------------------------------------------------

describe('데이터가 Json구조가 아닌지 검사', () => {
    it(`데이터가 Json구조 아니면 통과`, async () => {
        // Given
        const data = 1;

        // When
        const result = isNotJson(data);

        // Than
        expect(result).toBeTruthy();
    });

    it(`데이터가 Json구조 이면 실패`, async () => {
        // Given
        const data = {
            test: 'test',
        };

        // When
        const result = isNotJson(data);

        // Than
        expect(result).not.toBeTruthy();
    });
});
