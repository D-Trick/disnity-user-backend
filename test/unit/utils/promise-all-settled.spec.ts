// utils
import { promiseAllSettled } from '@utils/index';

// ----------------------------------------------------------------------

describe('Custom Promise.allSettled Test', () => {
    it(`함수를 전부 호출 후 실패가 없으면 통과`, async () => {
        // Given
        const fnTest1 = Promise.resolve(1);
        const fnTest2 = Promise.resolve(2);
        const fnTest3 = Promise.resolve(3);

        // When
        const result = await promiseAllSettled([fnTest1, fnTest2, fnTest3]);

        // Than
        expect(result[0]).toBe(1);
        expect(result[1]).toBe(2);
        expect(result[2]).toBe(3);
    });

    it(`함수를 전부 호출 후 하나라도 실패가 있으면 예외 던지기`, async () => {
        // Given
        const fnTest1 = Promise.resolve(1);
        const fnTest2 = Promise.reject(null);
        const fnTest3 = Promise.resolve(3);

        // When
        const promises = promiseAllSettled([fnTest1, fnTest2, fnTest3]);

        // Than
        expect(promises).rejects.toThrow();
    });
});
