// test
import { Test } from '@nestjs/testing';
import { mock, instance, when } from 'ts-mockito';
// dtos
import { CommonCodeListResponseDto } from '@models/common-code/dtos';
// controllers
import { CommonCodeController } from '@models/common-code/common-code.controller';
// services
import { CommonCodeService } from '@models/common-code/common-code.service';
// entities
import { CommonCode } from '@databases/entities/common-code.entity';

// ----------------------------------------------------------------------

describe('CommonCodeController 테스트를 시작합니다.', () => {
    let commonCodeController: CommonCodeController;

    const commonCodeServiceMock: CommonCodeService = mock(CommonCodeService);

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            controllers: [CommonCodeController],
            providers: [{ provide: CommonCodeService, useValue: instance(commonCodeServiceMock) }],
        }).compile();

        commonCodeController = moduleRef.get<CommonCodeController>(CommonCodeController);
    });

    it(`공통코드 목록을 조회합니다.`, async () => {
        // Given
        const param: any = {
            code: 'code',
        };
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
        when(commonCodeServiceMock.getCommonCodes(param.code)).thenResolve(dataMock);

        // When
        const commonCodes = await commonCodeController.commonCodeList(param);

        // Than
        expect(commonCodes[0]).toStrictEqual(new CommonCodeListResponseDto(dataMock[0]));
    });
});
