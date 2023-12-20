// utils
import { isAllEmpty } from '@utils/index';

// ----------------------------------------------------------------------

describe('isAllEmpty 테스트', () => {
    it(`배열 안에 값이 전부 비어있으면 통과한다`, async () => {
        // Given
        const data = [];

        // When
        const result = isAllEmpty(data);

        // Than
        expect(result).toBeTruthy();
    });

    it(`배열 안에 값이 단 하나라도 비어있지않으면 실패한다`, async () => {
        // Given
        const data = [1, 0];

        // When
        const result = isAllEmpty(data);

        // Than
        expect(result).not.toBeTruthy();
    });

    it(`배열 안에 값이 문자열 또는 숫자가 아니면 예외가 발생한다`, async () => {
        // Given
        const data = [{}] as any;

        // When
        const result = () => isAllEmpty(data);

        // Than
        expect(result).toThrow();
    });
});
