// lib
import 'reflect-metadata';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
// utils
import { createFakeString } from 'test/mock/utils/createFakeString';
// configs
import { validationPipeConfig } from '@config/validation-pipe.config';
// messages
import { SERVER_ERROR_MESSAGES } from '@common/messages';
// dtos
import { TagsRequestDto } from '@models/servers/dtos';
import { UpdateRequestDto } from '@models/servers/dtos/update-request.dto';

// ----------------------------------------------------------------------

describe('서버 수정(UpdateRequestDTO) 유효성 검사를 한다.', () => {
    const dto = new UpdateRequestDto();

    beforeEach(() => {
        dto.serverOpen = 'public';
        dto.categoryId = 1;
        dto.linkType = 'invite';
        dto.inviteAuto = 'auto';
        dto.inviteCode = 'ASD#$%';
        dto.channelId = '1';
        dto.membershipUrl = 'https://naver.com';
        dto.tags = [];
        dto.summary = '';
        dto.contentType = 'markdown';
        dto.content = '';
    });

    describe('서버 공개 여부로 요청한 값을 유효성 검사를 한다.', () => {
        it(`공개 이면 유효성 검사 통과`, async () => {
            // Given
            dto.serverOpen = 'public';

            // When
            const errors = await validate(dto, validationPipeConfig);

            // Than
            expect(errors.length).toBe(0);
        });

        it(`비공개 이면 유효성 검사 통과`, async () => {
            // Given
            dto.serverOpen = 'private';

            // When
            const errors = await validate(dto, validationPipeConfig);

            // Than
            expect(errors.length).toBe(0);
        });

        it(`공개 또는 비공개가 아니면 유효성 검사 실패`, async () => {
            // Given
            dto.serverOpen = 'test' as any;

            // When
            const errors = await validate(dto, validationPipeConfig);

            // Than
            expect(errors[0].constraints['isIn']).toBe(SERVER_ERROR_MESSAGES.BAD_SERVER_OPEN);
        });
    });

    describe('서버 카테고리 id로 요청한 값을 유효성 검사를 한다.', () => {
        it(`정수가 최소 1이면 유효성 검사 통과`, async () => {
            // Given
            dto.categoryId = 1;

            // When
            const errors = await validate(dto, validationPipeConfig);

            // Than
            expect(errors.length).toBe(0);
        });

        it(`정수가 최대 65535이면 유효성 검사 통과`, async () => {
            // Given
            dto.categoryId = 65535;

            // When
            const errors = await validate(dto, validationPipeConfig);

            // Than
            expect(errors.length).toBe(0);
        });

        it(`정수가 최소 0이하이면 유효성 검사 실패`, async () => {
            // Given
            dto.categoryId = 0;

            // When
            const errors = await validate(dto, validationPipeConfig);

            // Than
            expect(errors[0].constraints['min']).toBe(SERVER_ERROR_MESSAGES.CATEGORY_NOT_FOUND);
        });

        it(`정수가 최대 66536이상이면 유효성 검사 실패`, async () => {
            // Given
            dto.categoryId = 65536;

            // When
            const errors = await validate(dto, validationPipeConfig);

            // Than
            expect(errors[0].constraints['max']).toBe(SERVER_ERROR_MESSAGES.CATEGORY_NOT_FOUND);
        });
    });

    describe('서버 링크 유형으로 요청한 값을 유효성 검사를 한다.', () => {
        it(`초대 유형이면 유효성 검사 통과`, async () => {
            // Given
            dto.linkType = 'invite';

            // When
            const errors = await validate(dto, validationPipeConfig);

            // Than
            expect(errors.length).toBe(0);
        });

        it(`가입문의 유형이면 유효성 검사 통과`, async () => {
            // Given
            dto.linkType = 'membership';

            // When
            const errors = await validate(dto, validationPipeConfig);

            // Than
            expect(errors.length).toBe(0);
        });

        it(`초대 유형 또는 가입문의 유형이 아니면 유효성 검사 실패`, async () => {
            // Given
            dto.linkType = 'test' as any;

            // When
            const errors = await validate(dto, validationPipeConfig);

            // Than
            expect(errors[0].constraints['isIn']).toBe(SERVER_ERROR_MESSAGES.BAD_LINK_TYPE);
        });
    });

    describe('서버 초대 유형으로 요청한 값을 유효성 검사를 한다.', () => {
        it(`자동 이면 유효성 검사 통과`, async () => {
            // Given
            dto.inviteAuto = 'auto';

            // When
            const errors = await validate(dto, validationPipeConfig);

            // Than
            expect(errors.length).toBe(0);
        });

        it(`수동 이면 유효성 검사 통과`, async () => {
            // Given
            dto.inviteAuto = 'manual';

            // When
            const errors = await validate(dto, validationPipeConfig);

            // Than
            expect(errors.length).toBe(0);
        });

        it(`자동 또는 수동이 아니면 유효성 검사 실패`, async () => {
            // Given
            dto.inviteAuto = 'test' as any;

            // When
            const errors = await validate(dto, validationPipeConfig);

            // Than
            expect(errors[0].constraints['isIn']).toBe(SERVER_ERROR_MESSAGES.BAD_INVITE_AUTO);
        });
    });

    describe('서버 초대코드로 요청한 값을 유효성 검사를 한다.', () => {
        it(`초대코드가 있고 문자열이면서 15글자 이하이면 유효성 검사 통과`, async () => {
            // Given
            dto.linkType = 'invite';
            dto.inviteAuto = 'manual';
            dto.inviteCode = createFakeString('a', 15);

            // When
            const errors = await validate(dto, validationPipeConfig);

            // Than
            expect(errors.length).toBe(0);
        });

        it(`초대코드가 없으면 유효성 검사 실패`, async () => {
            // Given
            dto.linkType = 'invite';
            dto.inviteAuto = 'manual';
            dto.inviteCode = '';

            // When
            const errors = await validate(dto, validationPipeConfig);

            // Than
            expect(errors[0].constraints['isNotEmpty']).toBe(SERVER_ERROR_MESSAGES.INVITE_EMPTY);
        });

        it(`문자열이 아니면 유효성 검사 실패`, async () => {
            // Given
            dto.linkType = 'invite';
            dto.inviteAuto = 'manual';
            dto.inviteCode = 1111 as any;

            // When
            const errors = await validate(dto, validationPipeConfig);

            // Than
            expect(errors[0].constraints['maxLength']).toBe(SERVER_ERROR_MESSAGES.INVITE_MAX_LENGTH);
        });

        it(`23글자 이상이면 유효성 검사 실패`, async () => {
            // Given
            dto.linkType = 'invite';
            dto.inviteAuto = 'manual';
            dto.inviteCode = createFakeString('a', 23);

            // When
            const errors = await validate(dto, validationPipeConfig);

            // Than
            expect(errors[0].constraints['maxLength']).toBe(SERVER_ERROR_MESSAGES.INVITE_MAX_LENGTH);
        });
    });

    describe('서버 채널 id로 요청한 값을 유효성 검사를 한다.', () => {
        it(`정수이고 22글자 이하이면 유효성 검사 통과`, async () => {
            // Given
            dto.linkType = 'invite';
            dto.inviteAuto = 'auto';
            dto.channelId = createFakeString('1', 22);

            // When
            const errors = await validate(dto, validationPipeConfig);

            // Than
            expect(errors.length).toBe(0);
        });

        it(`정수가 아니면 유효성 검사 실패`, async () => {
            // Given
            dto.linkType = 'invite';
            dto.inviteAuto = 'auto';
            dto.channelId = createFakeString('a', 22);

            // When
            const errors = await validate(dto, validationPipeConfig);

            // Than
            expect(errors[0].constraints['isNumberString']).toBe(SERVER_ERROR_MESSAGES.CHANNEL_NOT_FOUND);
        });

        it(`23글자 이상이면 유효성 검사 실패`, async () => {
            // Given
            dto.linkType = 'invite';
            dto.inviteAuto = 'auto';
            dto.channelId = createFakeString('a', 23);

            // When
            const errors = await validate(dto, validationPipeConfig);

            // Than
            expect(errors[0].constraints['isNumberString']).toBe(SERVER_ERROR_MESSAGES.CHANNEL_NOT_FOUND);
        });
    });

    describe('서버 가입문의 URL로 요청한 값을 유효성 검사를 한다.', () => {
        it(`URL이 있고 URL(http/https 포함)형식이면 유효성 검사 통과`, async () => {
            // Given
            dto.linkType = 'membership';
            dto.membershipUrl = 'https://naver.com';

            // When
            const errors = await validate(dto, validationPipeConfig);

            // Than
            expect(errors.length).toBe(0);
        });

        it(`URL이 없으면 유효성 검사 실패`, async () => {
            // Given
            dto.linkType = 'membership';
            dto.membershipUrl = '';

            // When
            const errors = await validate(dto, validationPipeConfig);

            // Than
            expect(errors[0].constraints['isNotEmpty']).toBe(SERVER_ERROR_MESSAGES.MEMBERSHIP_URL_EMPTY);
        });

        it(`URL(http/https 포함)형식이 아니면 유효성 검사 실패`, async () => {
            // Given
            dto.linkType = 'membership';
            dto.membershipUrl = 'naver.com';

            // When
            const errors = await validate(dto, validationPipeConfig);

            // Than
            expect(errors[0].constraints['isUrl']).toBe(SERVER_ERROR_MESSAGES.INVALID_MEMBERSHIP_URL_FORMAT);
        });
    });

    describe('서버 태그 목록으로 요청한 값을 유효성 검사를 한다.', () => {
        it(`[ #, /, &, ?, \, *, @, %, +, 공백 ]이 없고 10글자 이하이면 유효성 검사 통과`, async () => {
            // Given
            const tag = plainToInstance(TagsRequestDto, { name: createFakeString('a', 10) });
            dto.tags = [tag];

            // When
            const errors = await validate(dto, validationPipeConfig);

            // Than
            expect(errors.length).toBe(0);
        });

        it(`[ #, /, &, ?, \, *, @, %, +, 공백 ]중에 하나라도 있으면 유효성 검사 실패`, async () => {
            // Given
            const testSpecialCharacters = ['# ', '/', '&', '?', '\\', '*', '@', '%', '+', ' '];

            testSpecialCharacters.map(async (sc) => {
                const tag = plainToInstance(TagsRequestDto, { name: sc });
                dto.tags = [tag];

                // When
                const errors = await validate(dto, validationPipeConfig);

                // Than
                expect(errors[0].children[0].children[0].constraints['matches']).toBe(
                    SERVER_ERROR_MESSAGES.INVALID_TAG_NAME_CHARS,
                );
            });
        });

        it(`11글자 이상이면 유효성 검사 실패`, async () => {
            // Given
            const tag = plainToInstance(TagsRequestDto, { name: createFakeString('a', 11) });
            dto.tags = [tag];

            // When
            const errors = await validate(dto, validationPipeConfig);

            // Than
            expect(errors[0].children[0].children[0].constraints['maxLength']).toBe(
                SERVER_ERROR_MESSAGES.TAG_NAME_MAX_LENGTH,
            );
        });
    });

    describe('서버 요약 설명으로 요청한 값을 유효성 검사를 한다.', () => {
        it(`250글자 이하이면 유효성 검사 통과`, async () => {
            // Given
            dto.summary = createFakeString('a', 250);

            // When
            const errors = await validate(dto, validationPipeConfig);

            // Than
            expect(errors.length).toBe(0);
        });

        it(`251글자 이상이면 유효성 검사 실패`, async () => {
            // Given
            dto.summary = createFakeString('a', 251);

            // When
            const errors = await validate(dto, validationPipeConfig);

            // Than
            expect(errors[0].constraints['maxLength']).toBe(SERVER_ERROR_MESSAGES.SUMMARY_MAX_LENGTH);
        });
    });

    describe('서버 설명 표시 유형으로 요청한 값을 유효성 검사를 한다.', () => {
        it(`기본 이면 유효성 검사 통과`, async () => {
            // Given
            dto.contentType = 'basic';

            // When
            const errors = await validate(dto, validationPipeConfig);

            // Than
            expect(errors.length).toBe(0);
        });

        it(`마크다운 이면 유효성 검사 통과`, async () => {
            // Given
            dto.contentType = 'markdown';

            // When
            const errors = await validate(dto, validationPipeConfig);

            // Than
            expect(errors.length).toBe(0);
        });

        it(`기본 또는 마크다운이 아니면 유효성 검사 실패`, async () => {
            // Given
            dto.contentType = 'test' as any;

            // When
            const errors = await validate(dto, validationPipeConfig);

            // Than
            expect(errors[0].constraints['isIn']).toBe(SERVER_ERROR_MESSAGES.BAD_INVITE_AUTO);
        });
    });
});
