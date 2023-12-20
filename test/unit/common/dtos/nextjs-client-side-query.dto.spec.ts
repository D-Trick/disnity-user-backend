// lib
import { validate } from 'class-validator';
// utils
import { createFakeString } from 'test/mock/utils/createFakeString';
// configs
import { validationPipeConfig } from '@config/validation-pipe.config';
// dtos
import { NextjsClientSideQueryDto } from '@common/dtos';

// ----------------------------------------------------------------------

describe('NextJS에서 NestJS로 요청할때 유효성 검사', () => {
    const dto = new NextjsClientSideQueryDto();

    beforeEach(() => {
        dto.id = '';
        dto.name = '';
        dto.keyword = '';
    });

    it(`요청한 id가 100글자 이하이면 유효성 검사 통과`, async () => {
        const ERROR_COUNT = 0;
        dto.id = createFakeString('a', 100);

        const validateErrors = await validate(dto, validationPipeConfig);

        expect(validateErrors.length).toBe(ERROR_COUNT);
    });
    it(`요청한 id가 101글자 이상이면 유효성 검사 실패`, async () => {
        const ERROR_COUNT = 1;

        dto.id = createFakeString('a', 101);

        const validateErrors = await validate(dto, validationPipeConfig);

        expect(validateErrors.length).toBe(ERROR_COUNT);
    });

    it(`요청한 name이 5000글자 이하이면 유효성 검사 통과`, async () => {
        const ERROR_COUNT = 0;
        dto.name = createFakeString('a', 5000);

        const validateErrors = await validate(dto, validationPipeConfig);

        expect(validateErrors.length).toBe(ERROR_COUNT);
    });
    it(`요청한 name이 5001글자 이상이면 유효성 검사 실패`, async () => {
        const ERROR_COUNT = 1;
        dto.name = createFakeString('a', 5001);

        const validateErrors = await validate(dto, validationPipeConfig);

        expect(validateErrors.length).toBe(ERROR_COUNT);
    });

    it(`요청한 keyword가가 5000글자 이하이면 유효성 검사 통과`, async () => {
        const ERROR_COUNT = 0;
        dto.keyword = createFakeString('a', 5000);

        const validateErrors = await validate(dto, validationPipeConfig);

        expect(validateErrors.length).toBe(ERROR_COUNT);
    });
    it(`요청한 keyword가 5001글자 이상이면 유효성 검사 실패`, async () => {
        const ERROR_COUNT = 1;
        dto.keyword = createFakeString('a', 5001);
        const validateErrors = await validate(dto, validationPipeConfig);

        expect(validateErrors.length).toBe(ERROR_COUNT);
    });
});
