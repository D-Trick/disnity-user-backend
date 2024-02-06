// utils
import { ErrorResponse } from '@utils/response';

// ----------------------------------------------------------------------

describe('error-response 테스트', () => {
    it(`응답 객체에서 응답 값에 information이 존재할때`, async () => {
        // Given
        const status = 401;
        const message = 'test';
        const information = {
            auth: 'jwt',
            isRedirect: true,
        };

        // When
        const errorResponse = ErrorResponse.create(status, message, information);

        // Than
        expect(errorResponse.statusCode).toBe(401);
        expect(errorResponse.error).toBe('UNAUTHORIZED');
        expect(errorResponse.message).toBe('test');
        expect(errorResponse.information.auth).toBe('jwt');
        expect(errorResponse.information.isRedirect).toBeTruthy();
    });

    it(`응답 객체에서 응답 값에 information이 존재하지 않을때`, async () => {
        // Given
        const status = 400;
        const message = 'test';

        // When
        const errorResponse = ErrorResponse.create(status, message);

        // Than
        expect(errorResponse.statusCode).toBe(400);
        expect(errorResponse.error).toBe('BAD_REQUEST');
        expect(errorResponse.message).toBe('test');
        expect(errorResponse.information).toBe(undefined);
    });
});
