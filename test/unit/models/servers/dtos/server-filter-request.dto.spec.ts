// lib
import { validate } from 'class-validator';
// test utils
import { createFakeString } from 'test/mock/utils/createFakeString';
// configs
import { validationPipeConfig } from '@config/validation-pipe.config';
// dtos
import { ServerFilterRequestDto } from '@models/servers/dtos';

// ----------------------------------------------------------------------

describe('서버 정렬 및 필터(ServerFilterRequestDTO) 유효성 검사를 한다.', () => {
    describe('서버 정렬로 요청한 값을 유효성 검사를 한다.', () => {
        it(`10글자 이하이면 유효성 검사 통과`, async () => {
            // Given
            const ERROR_COUNT = 0;
            const dto = new ServerFilterRequestDto();
            dto.sort = createFakeString('a', 10);

            // When
            const validateErrors = await validate(dto, validationPipeConfig);

            // Than
            expect(validateErrors.length).toBe(ERROR_COUNT);
        });
        it(`11글자 이상이면 유효성 검사 실패`, async () => {
            // Given
            const ERROR_COUNT = 1;
            const dto = new ServerFilterRequestDto();
            dto.sort = createFakeString('a', 11);

            // When
            const validateErrors = await validate(dto, validationPipeConfig);

            // Than
            expect(validateErrors.length).toBe(ERROR_COUNT);
        });

        it(`sort가 있는 리터럴 객체를 반환한다.`, async () => {
            // Given
            const dto1 = new ServerFilterRequestDto();
            const dto2 = new ServerFilterRequestDto();
            const dto3 = new ServerFilterRequestDto();
            dto1.sort = 'create';
            dto2.sort = 'member';
            dto3.sort = 'refresh_date';

            // When
            const sort1 = dto1.toServerSort();
            const sort2 = dto2.toServerSort();
            const sort3 = dto3.toServerSort();

            // Than
            expect(sort1).toBe('created_at');
            expect(sort2).toBe('member');
            expect(sort3).toBe('refresh_date');
        });
    });

    describe('서버 멤버수로 요청한 값을 유효성 검사를 한다.', () => {
        it(`최소 인원수가 5000명 이하이면 유효성 검사 통과`, async () => {
            // Given
            const ERROR_COUNT = 0;
            const dto = new ServerFilterRequestDto();
            dto.min = 5000;

            // When
            const validateErrors = await validate(dto, validationPipeConfig);

            // Than
            expect(validateErrors.length).toBe(ERROR_COUNT);
        });
        it(`최소 인원수가 5001명 이상이면 유효성 검사 실패`, async () => {
            // Given
            const ERROR_COUNT = 1;
            const dto = new ServerFilterRequestDto();
            dto.min = 5001;

            // When
            const validateErrors = await validate(dto, validationPipeConfig);

            // Than
            expect(validateErrors.length).toBe(ERROR_COUNT);
        });

        it(`최대 인원수가 5000명 이하이면 유효성 검사 통과`, async () => {
            // Given
            const ERROR_COUNT = 0;
            const dto = new ServerFilterRequestDto();
            dto.min = 5000;

            // When
            const validateErrors = await validate(dto, validationPipeConfig);

            // Than
            expect(validateErrors.length).toBe(ERROR_COUNT);
        });
        it(`최대 인원수가 5001명 이상이면 유효성 검사 실패`, async () => {
            // Given
            const ERROR_COUNT = 1;
            const dto = new ServerFilterRequestDto();
            dto.min = 5001;

            // When
            const validateErrors = await validate(dto, validationPipeConfig);

            // Than
            expect(validateErrors.length).toBe(ERROR_COUNT);
        });

        it(`min / max가 있는 리터럴 객체를 반환한다.`, async () => {
            // Given
            const dto = new ServerFilterRequestDto();
            dto.min = 10;
            dto.max = 100;

            // When
            const memberRange = dto.toMemberRange();

            // Than
            expect(memberRange.min).toBe(10);
            expect(memberRange.max).toBe(100);
        });
    });
});
