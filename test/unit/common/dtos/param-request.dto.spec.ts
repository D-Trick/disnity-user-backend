// lib
import { validate } from 'class-validator';
// utils
import { createFakeString } from 'test/mock/utils/createFakeString';
// configs
import { validationPipeConfig } from '@config/validation-pipe.config';
// dtos
import {
    ParamCodeRequestDto,
    ParamGuildIdRequestDto,
    ParamIdNumberRequestDto,
    ParamIdStringRequestDto,
    ParamKeywordRequestDto,
    ParamNameRequestDto,
    ParamTypeAndGuildIdRequestDto,
    ParamTypeRequestDto,
} from '@common/dtos';

// ----------------------------------------------------------------------

describe('Dynamic Param 유효성 검사', () => {
    describe('Param - id 유효성 검사', () => {
        it(`20글자 이하이면 유효성 검사 통과`, async () => {
            const ERROR_COUNT = 0;
            const dto = new ParamIdStringRequestDto();
            dto.id = createFakeString('1', 20);

            const validateErrors = await validate(dto, validationPipeConfig);

            expect(validateErrors.length).toBe(ERROR_COUNT);
        });
        it(`21글자 이상이면 유효성 검사 실패`, async () => {
            const ERROR_COUNT = 1;
            const dto = new ParamIdStringRequestDto();
            dto.id = createFakeString('1', 21);

            const validateErrors = await validate(dto, validationPipeConfig);

            expect(validateErrors.length).toBe(ERROR_COUNT);
        });

        it(`숫자이면 유효성 검사 통과`, async () => {
            const ERROR_COUNT = 0;
            const dto = new ParamIdNumberRequestDto();
            dto.id = 1;

            const validateErrors = await validate(dto, validationPipeConfig);

            expect(validateErrors.length).toBe(ERROR_COUNT);
        });
        it(`숫자가 아니면 유효성 검사 실패`, async () => {
            const ERROR_COUNT = 1;
            const dto = new ParamIdNumberRequestDto();
            dto.id = 'a' as any;

            const validateErrors = await validate(dto, validationPipeConfig);

            expect(validateErrors.length).toBe(ERROR_COUNT);
        });
    });

    describe('Param - guildId 유효성 검사', () => {
        it(`20글자 이하이면 유효성 검사 통과`, async () => {
            const ERROR_COUNT = 0;
            const dto = new ParamGuildIdRequestDto();
            dto.guildId = createFakeString('1', 20);

            const validateErrors = await validate(dto, validationPipeConfig);

            expect(validateErrors.length).toBe(ERROR_COUNT);
        });
        it(`21글자 이상이면 유효성 검사 실패`, async () => {
            const ERROR_COUNT = 1;
            const dto = new ParamGuildIdRequestDto();
            dto.guildId = createFakeString('1', 21);

            const validateErrors = await validate(dto, validationPipeConfig);

            expect(validateErrors.length).toBe(ERROR_COUNT);
        });
    });

    describe('Param - type 유효성 검사', () => {
        it(`20글자 이하이면 유효성 검사 통과`, async () => {
            const ERROR_COUNT = 0;
            const dto = new ParamTypeRequestDto();
            dto.type = createFakeString('1', 20);

            const validateErrors = await validate(dto, validationPipeConfig);

            expect(validateErrors.length).toBe(ERROR_COUNT);
        });
        it(`21글자 이상이면 유효성 검사 실패`, async () => {
            const ERROR_COUNT = 1;
            const dto = new ParamTypeRequestDto();
            dto.type = createFakeString('1', 21);

            const validateErrors = await validate(dto, validationPipeConfig);

            expect(validateErrors.length).toBe(ERROR_COUNT);
        });
    });

    describe('Param - type, guildId 유효성 검사', () => {
        it(`type이 10글자 / guildId 20글자 이하이면 유효성 검사 통과`, async () => {
            const ERROR_COUNT = 0;
            const dto = new ParamTypeAndGuildIdRequestDto();
            dto.type = createFakeString('1', 10);
            dto.guildId = createFakeString('1', 20);

            const validateErrors = await validate(dto, validationPipeConfig);

            expect(validateErrors.length).toBe(ERROR_COUNT);
        });
        it(`type이 11글자 / guildId 21글자 이하이면 유효성 검사 실패`, async () => {
            const ERROR_COUNT = 2;
            const dto = new ParamTypeAndGuildIdRequestDto();
            dto.type = createFakeString('1', 11);
            dto.guildId = createFakeString('1', 21);

            const validateErrors = await validate(dto, validationPipeConfig);

            expect(validateErrors.length).toBe(ERROR_COUNT);
        });
    });

    describe('Param - name 유효성 검사', () => {
        it(`20글자 이하이면 유효성 검사 통과`, async () => {
            const ERROR_COUNT = 0;
            const dto = new ParamNameRequestDto();
            dto.name = createFakeString('1', 20);

            const validateErrors = await validate(dto, validationPipeConfig);

            expect(validateErrors.length).toBe(ERROR_COUNT);
        });
        it(`21글자 이상이면 유효성 검사 실패`, async () => {
            const ERROR_COUNT = 1;
            const dto = new ParamNameRequestDto();
            dto.name = createFakeString('1', 21);

            const validateErrors = await validate(dto, validationPipeConfig);

            expect(validateErrors.length).toBe(ERROR_COUNT);
        });
    });

    describe('Param - keyword 유효성 검사', () => {
        it(`50글자 이하이면 유효성 검사 통과`, async () => {
            const ERROR_COUNT = 0;
            const dto = new ParamKeywordRequestDto();
            dto.keyword = createFakeString('1', 50);

            const validateErrors = await validate(dto, validationPipeConfig);

            expect(validateErrors.length).toBe(ERROR_COUNT);
        });
        it(`51글자 이상이면 유효성 검사 실패`, async () => {
            const ERROR_COUNT = 1;
            const dto = new ParamKeywordRequestDto();
            dto.keyword = createFakeString('1', 51);

            const validateErrors = await validate(dto, validationPipeConfig);

            expect(validateErrors.length).toBe(ERROR_COUNT);
        });
    });

    describe('Param - code 유효성 검사', () => {
        it(`20글자 이하이면 유효성 검사 통과`, async () => {
            const ERROR_COUNT = 0;
            const dto = new ParamCodeRequestDto();
            dto.code = createFakeString('1', 20);

            const validateErrors = await validate(dto, validationPipeConfig);

            expect(validateErrors.length).toBe(ERROR_COUNT);
        });
        it(`21글자 이상이면 유효성 검사 실패`, async () => {
            const ERROR_COUNT = 1;
            const dto = new ParamCodeRequestDto();
            dto.code = createFakeString('1', 21);

            const validateErrors = await validate(dto, validationPipeConfig);

            expect(validateErrors.length).toBe(ERROR_COUNT);
        });
    });
});
