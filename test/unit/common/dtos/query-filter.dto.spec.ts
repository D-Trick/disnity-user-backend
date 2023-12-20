// lib
import { validate } from 'class-validator';
// configs
import { validationPipeConfig } from '@config/validation-pipe.config';
// dtos
import { QueryFilterDto } from '@common/dtos';
import { createFakeString } from 'test/mock/utils/createFakeString';

// ----------------------------------------------------------------------

describe('공통 URL QueryString 유효성 검사', () => {
    it(`요청한 페이지가 4200000000 이하이면 유효성 검사 통과`, async () => {
        const ERROR_COUNT = 0;
        const dto = new QueryFilterDto();
        dto.page = 4200000000;

        const validateErrors = await validate(dto, validationPipeConfig);

        expect(validateErrors.length).toBe(ERROR_COUNT);
    });
    it(`요청한 페이지가 4200000001 이상이면 유효성 검사 실패`, async () => {
        const ERROR_COUNT = 1;
        const dto = new QueryFilterDto();
        dto.page = 4200000001;

        const validateErrors = await validate(dto, validationPipeConfig);

        expect(validateErrors.length).toBe(ERROR_COUNT);
    });

    it(`요청한 서버 노출 개수가 4200000000 이하이면 유효성 검사 통과`, async () => {
        const ERROR_COUNT = 0;
        const dto = new QueryFilterDto();
        dto.itemSize = 4200000000;

        const validateErrors = await validate(dto, validationPipeConfig);

        expect(validateErrors.length).toBe(ERROR_COUNT);
    });
    it(`요청한 서버 노출 개수가 4200000001 이상이면 유효성 검사 실패`, async () => {
        const ERROR_COUNT = 1;
        const dto = new QueryFilterDto();
        dto.itemSize = 4200000001;

        const validateErrors = await validate(dto, validationPipeConfig);

        expect(validateErrors.length).toBe(ERROR_COUNT);
    });

    it(`요청한 정렬이 10글자 이하이면 유효성 검사 통과`, async () => {
        const ERROR_COUNT = 0;
        const dto = new QueryFilterDto();
        dto.sort = createFakeString('a', 10);

        const validateErrors = await validate(dto, validationPipeConfig);

        expect(validateErrors.length).toBe(ERROR_COUNT);
    });
    it(`요청한 정렬이 11글자 이상이면 유효성 검사 실패`, async () => {
        const ERROR_COUNT = 1;
        const dto = new QueryFilterDto();
        dto.sort = createFakeString('a', 11);

        const validateErrors = await validate(dto, validationPipeConfig);

        expect(validateErrors.length).toBe(ERROR_COUNT);
    });

    it(`요청한 서버 멤버수 최소 인원수가 5000명 이하이면 유효성 검사 통과`, async () => {
        const ERROR_COUNT = 0;
        const dto = new QueryFilterDto();
        dto.min = 5000;

        const validateErrors = await validate(dto, validationPipeConfig);

        expect(validateErrors.length).toBe(ERROR_COUNT);
    });
    it(`요청한 서버 멤버수 최소 인원수가 5001명 이상이면 유효성 검사 실패`, async () => {
        const ERROR_COUNT = 1;
        const dto = new QueryFilterDto();
        dto.min = 5001;

        const validateErrors = await validate(dto, validationPipeConfig);

        expect(validateErrors.length).toBe(ERROR_COUNT);
    });

    it(`요청한 서버 멤버수 최대 인원수가 5000명 이하이면 유효성 검사 통과`, async () => {
        const ERROR_COUNT = 0;
        const dto = new QueryFilterDto();
        dto.min = 5000;

        const validateErrors = await validate(dto, validationPipeConfig);

        expect(validateErrors.length).toBe(ERROR_COUNT);
    });
    it(`요청한 서버 멤버수 최대 인원수가 5001명 이상이면 유효성 검사 실패`, async () => {
        const ERROR_COUNT = 1;
        const dto = new QueryFilterDto();
        dto.min = 5001;

        const validateErrors = await validate(dto, validationPipeConfig);

        expect(validateErrors.length).toBe(ERROR_COUNT);
    });
});
