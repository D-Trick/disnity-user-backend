// lib
import { validate } from 'class-validator';
// test utils
import { createFakeString } from 'test/mock/utils/createFakeString';
// configs
import { validationPipeConfig } from '@config/validation-pipe.config';
// messages
import { HTTP_ERROR_MESSAGES } from '@common/messages';
// dtos
import { DiscordCallbackRequestDto } from '@models/redirect/dtos';

// ----------------------------------------------------------------------

describe('Discord Callback Request DTO 유효성 검사', () => {
    it(`redirect로 요청된 값이 10글자 이하이면 유효성 검사 통과`, async () => {
        // Given
        const dto = new DiscordCallbackRequestDto();
        dto.redirect = createFakeString('a', 10);

        // When
        const errors = await validate(dto, validationPipeConfig);

        // Than
        expect(errors.length).toBe(0);
    });
    it(`redirect로 요청된 값이 11글자 이상이면 유효성 검사 실패`, async () => {
        // Given
        const dto = new DiscordCallbackRequestDto();
        dto.redirect = createFakeString('a', 11);

        // When
        const errors = await validate(dto, validationPipeConfig);

        // Than
        expect(errors[0].constraints['maxLength']).toBe(HTTP_ERROR_MESSAGES['900']);
    });

    it(`요청한 guildId가 20글자 이하이면 유효성 검사 통과`, async () => {
        // Given
        const dto = new DiscordCallbackRequestDto();
        dto.guild_id = createFakeString('a', 20);

        // When
        const errors = await validate(dto, validationPipeConfig);

        // Than
        expect(errors.length).toBe(0);
    });
    it(`요청한 guildId가 21글자 이상이면 유효성 검사 실패`, async () => {
        // Given
        const dto = new DiscordCallbackRequestDto();
        dto.guild_id = createFakeString('a', 21);

        // When
        const errors = await validate(dto, validationPipeConfig);

        // Than
        expect(errors[0].constraints['maxLength']).toBe(HTTP_ERROR_MESSAGES['900']);
    });

    it(`요청한 error가 100글자 이하이면 유효성 검사 통과`, async () => {
        // Given
        const dto = new DiscordCallbackRequestDto();
        dto.error = createFakeString('a', 100);

        // When
        const errors = await validate(dto, validationPipeConfig);

        // Than
        expect(errors.length).toBe(0);
    });
    it(`요청한 error가 101글자 이상이면 유효성 검사 실패`, async () => {
        // Given
        const dto = new DiscordCallbackRequestDto();
        dto.error = createFakeString('a', 101);

        // When
        const errors = await validate(dto, validationPipeConfig);

        // Than
        expect(errors[0].constraints['maxLength']).toBe(HTTP_ERROR_MESSAGES['900']);
    });
});
