// utils
import { ControllerException } from '@utils/response';

// ----------------------------------------------------------------------

describe('ControllerException 테스트', () => {
    it(`Controller에서 모든 에러를 예외로 던진다.`, async () => {
        // Given
        const error = new Error('test');

        // When
        const functionThrow = () => {
            throw new ControllerException(error);
        };

        // Than
        expect(functionThrow).toThrow('test');
    });
});
