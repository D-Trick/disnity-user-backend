// lib
import { validate } from 'class-validator';
// test utils
import { createFakeString } from 'test/mock/utils/createFakeString';
// configs
import { validationPipeConfig } from '@config/validation-pipe.config';
// dtos
import { DiscordCallbackRequestDto } from '@models/redirect/dtos';

// ----------------------------------------------------------------------

describe('Discord Callback Request DTO 유효성 검사', () => {
    it(`요청한 redirect가 10글자 이하이면 유효성 검사 통과`, async () => {
        // Given
        const ERROR_COUNT = 0;
        const dto = new DiscordCallbackRequestDto();
        dto.redirect = createFakeString('a', 10);

        // When
        const validateErrors = await validate(dto, validationPipeConfig);

        // Than
        expect(validateErrors.length).toBe(ERROR_COUNT);
    });
    it(`요청한 redirect가 11글자 이상이면 유효성 검사 실패`, async () => {
        // Given
        const ERROR_COUNT = 1;
        const dto = new DiscordCallbackRequestDto();
        dto.redirect = createFakeString('a', 11);

        // When
        const validateErrors = await validate(dto, validationPipeConfig);

        // Than
        expect(validateErrors.length).toBe(ERROR_COUNT);
    });

    it(`요청한 guildId가 20글자 이하이면 유효성 검사 통과`, async () => {
        // Given
        const ERROR_COUNT = 0;
        const dto = new DiscordCallbackRequestDto();
        dto.guild_id = createFakeString('a', 20);

        // When
        const validateErrors = await validate(dto, validationPipeConfig);

        // Than
        expect(validateErrors.length).toBe(ERROR_COUNT);
    });
    it(`요청한 guildId가 21글자 이상이면 유효성 검사 실패`, async () => {
        // Given
        const ERROR_COUNT = 1;
        const dto = new DiscordCallbackRequestDto();
        dto.guild_id = createFakeString('a', 21);

        // When
        const validateErrors = await validate(dto, validationPipeConfig);

        // Than
        expect(validateErrors.length).toBe(ERROR_COUNT);
    });

    it(`요청한 error가 100글자 이하이면 유효성 검사 통과`, async () => {
        // Given
        const ERROR_COUNT = 0;
        const dto = new DiscordCallbackRequestDto();
        dto.error = createFakeString('a', 100);

        // When
        const validateErrors = await validate(dto, validationPipeConfig);

        // Than
        expect(validateErrors.length).toBe(ERROR_COUNT);
    });
    it(`요청한 error가 101글자 이상이면 유효성 검사 실패`, async () => {
        // Given
        const ERROR_COUNT = 1;
        const dto = new DiscordCallbackRequestDto();
        dto.error = createFakeString('a', 101);

        // When
        const validateErrors = await validate(dto, validationPipeConfig);

        // Than
        expect(validateErrors.length).toBe(ERROR_COUNT);
    });
});
