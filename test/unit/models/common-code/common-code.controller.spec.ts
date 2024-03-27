// test
import { Test } from '@nestjs/testing';
import { mock, instance, when } from 'ts-mockito';
// lib
import { plainToInstance } from 'class-transformer';
// dtos
import { ParamCodeRequestDto } from '@common/dtos';
import { CommonCodeListResponseDto } from '@models/common-code/dtos';
// controllers
import { CommonCodeController } from '@models/common-code/common-code.controller';
// services
import { CommonCodeListService } from '@models/common-code/services/list.service';
// entities
import { CommonCode } from '@databases/entities/common-code.entity';

// ----------------------------------------------------------------------

describe('CommonCodeController', () => {
    let commonCodeController: CommonCodeController;

    const commonCodeListServiceMock: CommonCodeListService = mock(CommonCodeListService);

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            controllers: [CommonCodeController],
            providers: [{ provide: CommonCodeListService, useValue: instance(commonCodeListServiceMock) }],
        }).compile();

        commonCodeController = moduleRef.get<CommonCodeController>(CommonCodeController);
    });

    describe('commonCodeList', () => {
        it(`공통코드 목록을 조회한다`, async () => {
            // Given
            const param = plainToInstance(ParamCodeRequestDto, {
                code: 'code',
            });
            const dataMock: CommonCode[] = [
                {
                    id: 1,
                    code: param.code,
                    name: '',
                    value: '',
                    created_admin_id: '',
                    updated_admin_id: '',
                },
            ];
            when(commonCodeListServiceMock.getCommonCodes(param.code)).thenResolve(dataMock);

            // When
            const commonCodes = await commonCodeController.commonCodeList(param);

            // Than
            expect(commonCodes[0]).toStrictEqual(new CommonCodeListResponseDto(dataMock[0]));
        });
    });
});
