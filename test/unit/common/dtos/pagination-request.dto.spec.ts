// lib
import { validate } from 'class-validator';
// configs
import { validationPipeConfig } from '@config/validation-pipe.config';
// dtos
import { PaginationDtoRequest } from '@common/dtos';

// ----------------------------------------------------------------------

describe('Pagination Request DTO', () => {
    it(`요청한 페이지가 4200000000 이하이면 유효성 검사 통과`, async () => {
        // Given
        const ERROR_COUNT = 0;
        const dto = new PaginationDtoRequest();
        dto.page = 4200000000;

        // When
        const validateErrors = await validate(dto, validationPipeConfig);

        // Than
        expect(validateErrors.length).toBe(ERROR_COUNT);
    });
    it(`요청한 페이지가 4200000001 이상이면 유효성 검사 실패`, async () => {
        // Given
        const ERROR_COUNT = 1;
        const dto = new PaginationDtoRequest();
        dto.page = 4200000001;

        // When
        const validateErrors = await validate(dto, validationPipeConfig);

        // Than
        expect(validateErrors.length).toBe(ERROR_COUNT);
    });
    it(`요청한 페이지가 정수면 유효성 검사 통과`, async () => {
        // Given
        const ERROR_COUNT = 0;
        const dto = new PaginationDtoRequest();
        dto.page = 4200000000;

        // When
        const validateErrors = await validate(dto, validationPipeConfig);

        // Than
        expect(validateErrors.length).toBe(ERROR_COUNT);
    });
    it(`요청한 페이지가 정수가 아니면 유효성 검사 실패`, async () => {
        // Given
        const ERROR_COUNT = 1;
        const dto = new PaginationDtoRequest();
        dto.page = '1' as any;

        // When
        const validateErrors = await validate(dto, validationPipeConfig);

        // Than
        expect(validateErrors.length).toBe(ERROR_COUNT);
    });

    it(`요청한 서버 노출 개수가 4200000000 이하이면 유효성 검사 통과`, async () => {
        // Given
        const ERROR_COUNT = 0;
        const dto = new PaginationDtoRequest();
        dto.itemSize = 4200000000;

        // When
        const validateErrors = await validate(dto, validationPipeConfig);

        // Than
        expect(validateErrors.length).toBe(ERROR_COUNT);
    });
    it(`요청한 서버 노출 개수가 4200000001 이상이면 유효성 검사 실패`, async () => {
        // Given
        const ERROR_COUNT = 1;
        const dto = new PaginationDtoRequest();
        dto.itemSize = 4200000001;

        // When
        const validateErrors = await validate(dto, validationPipeConfig);

        // Than
        expect(validateErrors.length).toBe(ERROR_COUNT);
    });
    it(`요청한 서버 노출 개수가 정수면 유효성 검사 통과`, async () => {
        // Given
        const ERROR_COUNT = 0;
        const dto = new PaginationDtoRequest();
        dto.itemSize = 4200000000;

        // When
        const validateErrors = await validate(dto, validationPipeConfig);

        // Than
        expect(validateErrors.length).toBe(ERROR_COUNT);
    });
    it(`요청한 서버 노출 개수가 정수가 아니면 유효성 검사 실패`, async () => {
        // Given
        const ERROR_COUNT = 1;
        const dto = new PaginationDtoRequest();
        dto.itemSize = '1' as any;

        // When
        const validateErrors = await validate(dto, validationPipeConfig);

        // Than
        expect(validateErrors.length).toBe(ERROR_COUNT);
    });

    it(`toPagination()`, async () => {
        // Given
        const dto1 = new PaginationDtoRequest();
        const dto2 = new PaginationDtoRequest();
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
