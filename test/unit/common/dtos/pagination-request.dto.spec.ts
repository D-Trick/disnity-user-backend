// lib
import { validate } from 'class-validator';
// configs
import { validationPipeConfig } from '@config/validation-pipe.config';
// messages
import { HTTP_ERROR_MESSAGES } from '@common/messages';
// dtos
import { PaginationRequestDto } from '@common/dtos';

// ----------------------------------------------------------------------

describe('Pagination Request DTO 유효성 검사', () => {
    it(`페이지 요청 값이 4200000000 이하이면 유효성 검사 통과`, async () => {
        // Given
        const dto = new PaginationRequestDto();
        dto.page = 4200000000;

        // When
        const errors = await validate(dto, validationPipeConfig);

        // Than
        expect(errors.length).toBe(0);
    });
    it(`페이지 요청 값이 4200000001 이상이면 유효성 검사 실패`, async () => {
        // Given
        const dto = new PaginationRequestDto();
        dto.page = 4200000001;

        // When
        const errors = await validate(dto, validationPipeConfig);

        // Than
        expect(errors[0].constraints['max']).toBe(HTTP_ERROR_MESSAGES['900']);
    });
    it(`페이지 요청 값이 정수면 유효성 검사 통과`, async () => {
        // Given
        const dto = new PaginationRequestDto();
        dto.page = 4200000000;

        // When
        const errors = await validate(dto, validationPipeConfig);

        // Than
        expect(errors.length).toBe(0);
    });
    it(`페이지 요청 값이 정수가 아니면 유효성 검사 실패`, async () => {
        // Given
        const dto = new PaginationRequestDto();
        dto.page = '1' as any;

        // When
        const errors = await validate(dto, validationPipeConfig);

        // Than
        expect(errors[0].constraints['isInt']).toBe(HTTP_ERROR_MESSAGES['900']);
    });

    it(`서버표시개수 요청 값이 4200000000 이하이면 유효성 검사 통과`, async () => {
        // Given
        const dto = new PaginationRequestDto();
        dto.itemSize = 4200000000;

        // When
        const errors = await validate(dto, validationPipeConfig);

        // Than
        expect(errors.length).toBe(0);
    });
    it(`서버표시개수 요청 값이 4200000001 이상이면 유효성 검사 실패`, async () => {
        // Given
        const dto = new PaginationRequestDto();
        dto.itemSize = 4200000001;

        // When
        const errors = await validate(dto, validationPipeConfig);

        // Than
        expect(errors[0].constraints['max']).toBe(HTTP_ERROR_MESSAGES['900']);
    });
    it(`서버표시개수 요청 값이 정수면 유효성 검사 통과`, async () => {
        // Given
        const dto = new PaginationRequestDto();
        dto.itemSize = 4200000000;

        // When
        const errors = await validate(dto, validationPipeConfig);

        // Than
        expect(errors.length).toBe(0);
    });
    it(`서버표시개수 요청 값이 정수가 아니면 유효성 검사 실패`, async () => {
        // Given
        const dto = new PaginationRequestDto();
        dto.itemSize = '1' as any;

        // When
        const errors = await validate(dto, validationPipeConfig);

        // Than
        expect(errors[0].constraints['isInt']).toBe(HTTP_ERROR_MESSAGES['900']);
    });

    it(`limit / offset이 있는 리터럴 객체를 반환한다.`, async () => {
        // Given
        const dto1 = new PaginationRequestDto();
        const dto2 = new PaginationRequestDto();
        dto2.page = 3;
        dto2.itemSize = 999999;

        // When
        const p1 = dto1.toPagination();
        const p2 = dto2.toPagination();

        // Than
        expect(p1.limit).toBe(30);
        expect(p1.offset).toBe(0);

        expect(p2.limit).toBe(30);
        expect(p2.offset).toBe(60);
    });
});
