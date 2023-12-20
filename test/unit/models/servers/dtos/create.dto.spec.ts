// lib
import 'reflect-metadata';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
// utils
import { createFakeString } from 'test/mock/utils/createFakeString';
// configs
import { validationPipeConfig } from '@config/validation-pipe.config';
// dtos
import { TagsDto } from '@models/servers/dtos/routers';
import { CreateDto } from '@models/servers/dtos/routers/create.dto';

// ----------------------------------------------------------------------

describe('서버 추가 유효성 검사', () => {
    const dto = new CreateDto();

    beforeEach(() => {
        dto.id = '1';
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

    describe('Param - id 유효성 검사', () => {
        it(`서버 id가 22글자 이하이면서 숫자만 있을때 유효성 검사 통과`, async () => {
            const ERROR_COUNT = 0;
            dto.id = createFakeString('1', 22);

            const validateErrors = await validate(dto, validationPipeConfig);

            expect(validateErrors.length).toBe(ERROR_COUNT);
        });

        it(`서버 id가 22글자 이하이면서 숫자가 아니면 유효성 검사 실패`, async () => {
            const ERROR_COUNT = 1;
            dto.id = createFakeString('a', 22);

            const validateErrors = await validate(dto, validationPipeConfig);

            expect(validateErrors.length).toBe(ERROR_COUNT);
        });

        it(`서버 id가 23글자 이상이면서 숫자만 있을때 유효성 검사 실패`, async () => {
            const ERROR_COUNT = 1;
            dto.id = createFakeString('1', 23);

            const validateErrors = await validate(dto, validationPipeConfig);

            expect(validateErrors.length).toBe(ERROR_COUNT);
        });
    });

    describe('Param - serverOpen 유효성 검사', () => {
        it(`서버 공개여부가 public 이면 유효성 검사 통과`, async () => {
            const ERROR_COUNT = 0;
            dto.serverOpen = 'public';

            const validateErrors = await validate(dto, validationPipeConfig);

            expect(validateErrors.length).toBe(ERROR_COUNT);
        });

        it(`서버 공개여부가 private 이면 유효성 검사 통과`, async () => {
            const ERROR_COUNT = 0;
            dto.serverOpen = 'private';

            const validateErrors = await validate(dto, validationPipeConfig);

            expect(validateErrors.length).toBe(ERROR_COUNT);
        });

        it(`서버 공개여부가 public 또는 private가 아니면 유효성 검사 실패`, async () => {
            const ERROR_COUNT = 1;
            dto.serverOpen = 'test' as any;

            const validateErrors = await validate(dto, validationPipeConfig);

            expect(validateErrors.length).toBe(ERROR_COUNT);
        });
    });

    describe('Param - categoryId 유효성 검사', () => {
        it(`서버 카테고리 id가 최소값이 1이면 유효성 검사 통과`, async () => {
            const ERROR_COUNT = 0;
            dto.categoryId = 1;

            const validateErrors = await validate(dto, validationPipeConfig);

            expect(validateErrors.length).toBe(ERROR_COUNT);
        });

        it(`서버 카테고리 id가 최대값이 65535이면 유효성 검사 통과`, async () => {
            const ERROR_COUNT = 0;
            dto.categoryId = 65535;

            const validateErrors = await validate(dto, validationPipeConfig);

            expect(validateErrors.length).toBe(ERROR_COUNT);
        });

        it(`서버 카테고리 id가 최소값이 0이하이면 유효성 검사 실패`, async () => {
            const ERROR_COUNT = 1;
            dto.categoryId = 0;

            const validateErrors = await validate(dto, validationPipeConfig);

            expect(validateErrors.length).toBe(ERROR_COUNT);
        });

        it(`서버 카테고리 id가 최대값이 66536이상이면 유효성 검사 실패`, async () => {
            const ERROR_COUNT = 1;
            dto.categoryId = 65536;

            const validateErrors = await validate(dto, validationPipeConfig);

            expect(validateErrors.length).toBe(ERROR_COUNT);
        });
    });

    describe('Param - linkType 유효성 검사', () => {
        it(`서버 링크방식이 초대(invite) 이면 유효성 검사 통과`, async () => {
            const ERROR_COUNT = 0;
            dto.linkType = 'invite';

            const validateErrors = await validate(dto, validationPipeConfig);

            expect(validateErrors.length).toBe(ERROR_COUNT);
        });

        it(`서버 링크방식이 가입문의(membership) 이면 유효성 검사 통과`, async () => {
            const ERROR_COUNT = 0;
            dto.linkType = 'membership';

            const validateErrors = await validate(dto, validationPipeConfig);

            expect(validateErrors.length).toBe(ERROR_COUNT);
        });

        it(`서버 링크방식이 초대(invite) 또는 가입문의(membership)가 아니면 유효성 검사 실패`, async () => {
            const ERROR_COUNT = 1;
            dto.linkType = 'test' as any;

            const validateErrors = await validate(dto, validationPipeConfig);

            expect(validateErrors.length).toBe(ERROR_COUNT);
        });
    });

    describe('Param - inviteAuto 유효성 검사', () => {
        it(`서버 초대방식이 자동(auto) 이면 유효성 검사 통과`, async () => {
            const ERROR_COUNT = 0;
            dto.inviteAuto = 'auto';

            const validateErrors = await validate(dto, validationPipeConfig);

            expect(validateErrors.length).toBe(ERROR_COUNT);
        });

        it(`서버 초대방식이 수동(manual) 이면 유효성 검사 통과`, async () => {
            const ERROR_COUNT = 0;
            dto.inviteAuto = 'manual';

            const validateErrors = await validate(dto, validationPipeConfig);

            expect(validateErrors.length).toBe(ERROR_COUNT);
        });

        it(`서버 공개여부가 자동(auto) 또는 수동(manual)이 아니면 유효성 검사 실패`, async () => {
            const ERROR_COUNT = 1;
            dto.inviteAuto = 'test' as any;

            const validateErrors = await validate(dto, validationPipeConfig);

            expect(validateErrors.length).toBe(ERROR_COUNT);
        });
    });

    describe('Param - inviteCode 링크방식: 초대(invite) 이고 초대코드 생성방식: 수동(manual)이면 유효성 검사', () => {
        it(`서버 초대코드가 비어있지않고 문자열이고 15글자 이하이면 유효성 검사 통과`, async () => {
            const ERROR_COUNT = 0;
            dto.linkType = 'invite';
            dto.inviteAuto = 'manual';
            dto.inviteCode = createFakeString('a', 15);

            const validateErrors = await validate(dto, validationPipeConfig);

            expect(validateErrors.length).toBe(ERROR_COUNT);
        });

        it(`서버 초대코드가 비어있으면 유효성 검사 실패`, async () => {
            const ERROR_COUNT = 1;
            dto.linkType = 'invite';
            dto.inviteAuto = 'manual';
            dto.inviteCode = '';

            const validateErrors = await validate(dto, validationPipeConfig);

            expect(validateErrors.length).toBe(ERROR_COUNT);
        });

        it(`서버 초대코드가 문자열이 아니면 유효성 검사 실패`, async () => {
            const ERROR_COUNT = 1;
            dto.linkType = 'invite';
            dto.inviteAuto = 'manual';
            dto.inviteCode = 1111 as any;

            const validateErrors = await validate(dto, validationPipeConfig);

            expect(validateErrors.length).toBe(ERROR_COUNT);
        });

        it(`서버 초대코드가 23글자 이상이면 유효성 검사 실패`, async () => {
            const ERROR_COUNT = 1;
            dto.linkType = 'invite';
            dto.inviteAuto = 'manual';
            dto.inviteCode = createFakeString('a', 23);

            const validateErrors = await validate(dto, validationPipeConfig);

            expect(validateErrors.length).toBe(ERROR_COUNT);
        });
    });

    describe('Param - channelId 링크방식: 초대(invite) 이고 초대코드 생성방식: 자동(auto)이면 유효성 검사', () => {
        it(`서버 채널 id가 숫자이고 22글자 이하이면 유효성 검사 통과`, async () => {
            const ERROR_COUNT = 0;
            dto.linkType = 'invite';
            dto.inviteAuto = 'auto';
            dto.channelId = createFakeString('1', 22);

            const validateErrors = await validate(dto, validationPipeConfig);

            expect(validateErrors.length).toBe(ERROR_COUNT);
        });

        it(`서버 채널 id가 숫자가 아니면 유효성 검사 실패`, async () => {
            const ERROR_COUNT = 1;
            dto.linkType = 'invite';
            dto.inviteAuto = 'auto';
            dto.channelId = createFakeString('a', 22);

            const validateErrors = await validate(dto, validationPipeConfig);

            expect(validateErrors.length).toBe(ERROR_COUNT);
        });

        it(`서버 채널 id가 23글자 이상이면 유효성 검사 실패`, async () => {
            const ERROR_COUNT = 1;
            dto.linkType = 'invite';
            dto.inviteAuto = 'auto';
            dto.channelId = createFakeString('a', 23);

            const validateErrors = await validate(dto, validationPipeConfig);

            expect(validateErrors.length).toBe(ERROR_COUNT);
        });
    });

    describe('Param - membershipUrl 링크방식: 가입문의(membership)이면 유효성 검사', () => {
        it(`서버 가입문의(membership)이 링크가있고 URL(http/https 포함)형식이면 유효성 검사 통과`, async () => {
            const ERROR_COUNT = 0;
            dto.linkType = 'membership';
            dto.membershipUrl = 'https://naver.com';

            const validateErrors = await validate(dto, validationPipeConfig);

            expect(validateErrors.length).toBe(ERROR_COUNT);
        });

        it(`서버 가입문의(membership)이 링크가 없으면 유효성 검사 실패`, async () => {
            const ERROR_COUNT = 1;
            dto.linkType = 'membership';
            dto.membershipUrl = '';

            const validateErrors = await validate(dto, validationPipeConfig);

            expect(validateErrors.length).toBe(ERROR_COUNT);
        });

        it(`서버 가입문의(membership)이 URL(http/https 포함)형식이 아니면 유효성 검사 실패`, async () => {
            const ERROR_COUNT = 1;
            dto.linkType = 'membership';
            dto.membershipUrl = 'naver.com';

            const validateErrors = await validate(dto, validationPipeConfig);

            expect(validateErrors.length).toBe(ERROR_COUNT);
        });
    });

    describe('Param - tags 유효성 검사', () => {
        it(`서버 태그 목록에서 태그가 [ #, /, &, ?, \, *, @, %, +, 공백 ]이 없고 10글자 이하이면 유효성 검사 통과`, async () => {
            const ERROR_COUNT = 0;
            const tag = plainToInstance(TagsDto, { name: createFakeString('a', 10) });
            dto.tags = [tag];

            const validateErrors = await validate(dto, validationPipeConfig);

            expect(validateErrors.length).toBe(ERROR_COUNT);
        });

        it(`서버 태그 목록에서 태그가 [ #, /, &, ?, \, *, @, %, +, 공백 ]중에 하나라도 있으면 유효성 검사 실패`, async () => {
            const ERROR_COUNT = 1;
            const testSpecialCharacters = ['# ', '/', '&', '?', '\\', '*', '@', '%', '+', ' '];

            testSpecialCharacters.map(async (sc) => {
                const tag = plainToInstance(TagsDto, { name: sc });
                dto.tags = [tag];

                const validateErrors = await validate(dto, validationPipeConfig);

                expect(validateErrors.length).toBe(ERROR_COUNT);
            });
        });

        it(`서버 태그 목록에서 태그가 11글자 이상이면 유효성 검사 실패`, async () => {
            const ERROR_COUNT = 1;
            const tag = plainToInstance(TagsDto, { name: createFakeString('a', 11) });
            dto.tags = [tag];

            const validateErrors = await validate(dto, validationPipeConfig);

            expect(validateErrors.length).toBe(ERROR_COUNT);
        });
    });

    describe('Param - summary 유효성 검사', () => {
        it(`서버 요약 설명이 250글자 이하이면 유효성 검사 통과`, async () => {
            const ERROR_COUNT = 0;
            dto.summary = createFakeString('a', 250);

            const validateErrors = await validate(dto, validationPipeConfig);

            expect(validateErrors.length).toBe(ERROR_COUNT);
        });

        it(`서버 요약 설명이 251글자 이상이면 유효성 검사 실패`, async () => {
            const ERROR_COUNT = 1;
            dto.summary = createFakeString('a', 251);

            const validateErrors = await validate(dto, validationPipeConfig);

            expect(validateErrors.length).toBe(ERROR_COUNT);
        });
    });

    describe('Param - summary 유효성 검사', () => {
        it(`서버 요약 설명이 250글자 이하이면 유효성 검사 통과`, async () => {
            const ERROR_COUNT = 0;
            dto.summary = createFakeString('a', 250);

            const validateErrors = await validate(dto, validationPipeConfig);

            expect(validateErrors.length).toBe(ERROR_COUNT);
        });

        it(`서버 요약 설명이 251글자 이상이면 유효성 검사 실패`, async () => {
            const ERROR_COUNT = 1;
            dto.summary = createFakeString('a', 251);

            const validateErrors = await validate(dto, validationPipeConfig);

            expect(validateErrors.length).toBe(ERROR_COUNT);
        });
    });

    describe('Param - contentType 유효성 검사', () => {
        it(`서버 설명방식이 기본 이면 유효성 검사 통과`, async () => {
            const ERROR_COUNT = 0;
            dto.contentType = 'basic';

            const validateErrors = await validate(dto, validationPipeConfig);

            expect(validateErrors.length).toBe(ERROR_COUNT);
        });

        it(`서버 설명방식이 마크다운 이면 유효성 검사 통과`, async () => {
            const ERROR_COUNT = 0;
            dto.contentType = 'markdown';

            const validateErrors = await validate(dto, validationPipeConfig);

            expect(validateErrors.length).toBe(ERROR_COUNT);
        });

        it(`서버 설명방식이 기본 또는 마크다운이 아니면 유효성 검사 실패`, async () => {
            const ERROR_COUNT = 1;
            dto.contentType = 'test' as any;

            const validateErrors = await validate(dto, validationPipeConfig);

            expect(validateErrors.length).toBe(ERROR_COUNT);
        });
    });
});
