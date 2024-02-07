// lib
import { validate } from 'class-validator';
// utils
import { createFakeString } from 'test/mock/utils/createFakeString';
// configs
import { validationPipeConfig } from '@config/validation-pipe.config';
// messages
import { HTTP_ERROR_MESSAGES } from '@common/messages';
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

describe('Param Request DTO', () => {
    describe('id로 요청한 값 유효성 검사', () => {
        it(`20글자 이하이면 유효성 검사 통과`, async () => {
            // Given
            const dto = new ParamIdStringRequestDto();
            dto.id = createFakeString('1', 20);

            // When
            const errors = await validate(dto, validationPipeConfig);

            // Than
            expect(errors.length).toBe(0);
        });
        it(`21글자 이상이면 유효성 검사 실패`, async () => {
            // Given
            const dto = new ParamIdStringRequestDto();
            dto.id = createFakeString('1', 21);

            // When
            const erros = await validate(dto, validationPipeConfig);

            // Than
            expect(erros[0].constraints['maxLength']).toBe(HTTP_ERROR_MESSAGES['900']);
        });

        it(`숫자이면 유효성 검사 통과`, async () => {
            // Given
            const dto = new ParamIdNumberRequestDto();
            dto.id = 1;

            // When
            const errors = await validate(dto, validationPipeConfig);

            // Than
            expect(errors.length).toBe(0);
        });
        it(`숫자가 아니면 유효성 검사 실패`, async () => {
            // Given
            const dto = new ParamIdNumberRequestDto();
            dto.id = 'a' as any;

            // When
            const errors = await validate(dto, validationPipeConfig);

            // Than
            expect(errors[0].constraints['isInt']).toBe(HTTP_ERROR_MESSAGES['900']);
        });
    });

    describe('guildId로 요청한 값 유효성 검사', () => {
        it(`20글자 이하이면 유효성 검사 통과`, async () => {
            // Given
            const dto = new ParamGuildIdRequestDto();
            dto.guildId = createFakeString('1', 20);

            // When
            const errors = await validate(dto, validationPipeConfig);

            // Than
            expect(errors.length).toBe(0);
        });
        it(`21글자 이상이면 유효성 검사 실패`, async () => {
            // Given
            const dto = new ParamGuildIdRequestDto();
            dto.guildId = createFakeString('1', 21);

            // When
            const errors = await validate(dto, validationPipeConfig);

            // Than
            expect(errors[0].constraints['maxLength']).toBe(HTTP_ERROR_MESSAGES['900']);
        });
    });

    describe('type으로 요청한 값 유효성 검사', () => {
        it(`20글자 이하이면 유효성 검사 통과`, async () => {
            // Given
            const dto = new ParamTypeRequestDto();
            dto.type = createFakeString('1', 20);

            // When
            const errors = await validate(dto, validationPipeConfig);

            // Than
            expect(errors.length).toBe(0);
        });
        it(`21글자 이상이면 유효성 검사 실패`, async () => {
            // Given
            const dto = new ParamTypeRequestDto();
            dto.type = createFakeString('1', 21);

            // When
            const errors = await validate(dto, validationPipeConfig);

            // Than
            expect(errors[0].constraints['maxLength']).toBe(HTTP_ERROR_MESSAGES['900']);
        });
    });

    describe('type, guildId로 요청한 값 유효성 검사', () => {
        it(`요청한 type값이 10글자 이하 이면서 guildId값이 20글자 이하이면 유효성 검사 통과`, async () => {
            // Given
            const dto = new ParamTypeAndGuildIdRequestDto();
            dto.guildId = createFakeString('1', 20);
            dto.type = createFakeString('1', 10);

            // When
            const errors = await validate(dto, validationPipeConfig);

            // Than
            expect(errors.length).toBe(0);
        });
        it(`요청한 type값이 11글자 이상 이면서 guildId값이 21글자 이상이면 유효성 검사 실패`, async () => {
            // Given
            const dto = new ParamTypeAndGuildIdRequestDto();
            dto.guildId = createFakeString('1', 21);
            dto.type = createFakeString('1', 11);

            // When
            const errors = await validate(dto, validationPipeConfig);

            // Than
            expect(errors[0].constraints['maxLength']).toBe(HTTP_ERROR_MESSAGES['900']);
            expect(errors[1].constraints['maxLength']).toBe(HTTP_ERROR_MESSAGES['900']);
        });
    });

    describe('name으로 요청한 값 유효성 검사', () => {
        it(`20글자 이하이면 유효성 검사 통과`, async () => {
            // Given
            const dto = new ParamNameRequestDto();
            dto.name = createFakeString('1', 20);

            // When
            const errors = await validate(dto, validationPipeConfig);

            // Than
            expect(errors.length).toBe(0);
        });
        it(`21글자 이상이면 유효성 검사 실패`, async () => {
            // Given
            const dto = new ParamNameRequestDto();
            dto.name = createFakeString('1', 21);

            // When
            const errors = await validate(dto, validationPipeConfig);

            // Than
            expect(errors[0].constraints['maxLength']).toBe(HTTP_ERROR_MESSAGES['900']);
        });
    });

    describe('Param - keyword 유효성 검사', () => {
        it(`50글자 이하이면 유효성 검사 통과`, async () => {
            // Given
            const dto = new ParamKeywordRequestDto();
            dto.keyword = createFakeString('1', 50);

            // When
            const errors = await validate(dto, validationPipeConfig);

            // Than
            expect(errors.length).toBe(0);
        });
        it(`51글자 이상이면 유효성 검사 실패`, async () => {
            // Given
            const dto = new ParamKeywordRequestDto();
            dto.keyword = createFakeString('1', 51);

            // When
            const errors = await validate(dto, validationPipeConfig);

            // Than
            expect(errors[0].constraints['maxLength']).toBe(HTTP_ERROR_MESSAGES['900']);
        });
    });

    describe('Param - code 유효성 검사', () => {
        it(`20글자 이하이면 유효성 검사 통과`, async () => {
            // Given
            const dto = new ParamCodeRequestDto();
            dto.code = createFakeString('1', 20);

            // When
            const errors = await validate(dto, validationPipeConfig);

            // Than
            expect(errors.length).toBe(0);
        });
        it(`21글자 이상이면 유효성 검사 실패`, async () => {
            // Given
            const dto = new ParamCodeRequestDto();
            dto.code = createFakeString('1', 21);

            // When
            const errors = await validate(dto, validationPipeConfig);

            // Than
            expect(errors[0].constraints['maxLength']).toBe(HTTP_ERROR_MESSAGES['900']);
        });
    });
});
