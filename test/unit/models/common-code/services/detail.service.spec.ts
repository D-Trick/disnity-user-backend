// test
import { Test } from '@nestjs/testing';
import { mock, instance, when, anything } from 'ts-mockito';
// services
import { CommonCodeDetailService } from '@models/common-code/services/detail.service';
// entities
import { CommonCode } from '@databases/entities/common-code.entity';
// repositories
import { CommonCodeRepository } from '@databases/repositories/common-code';

// ----------------------------------------------------------------------

describe('CommonCodeDetailService 테스트를 시작합니다.', () => {
    let commonCodeDetailService: CommonCodeDetailService;

    const commonCodeRepositoryMock: CommonCodeRepository = mock(CommonCodeRepository);

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            providers: [
                CommonCodeDetailService,
                { provide: CommonCodeRepository, useValue: instance(commonCodeRepositoryMock) },
            ],
        }).compile();

        commonCodeDetailService = moduleRef.get<CommonCodeDetailService>(CommonCodeDetailService);
    });

    it(`공통코드를 조회합니다.`, async () => {
        // Given
        const param: any = {
            code: 'code',
            value: 'value',
        };
        const dataMock: CommonCode = {
            id: 1,
            code: param.code,
            name: 'name',
            value: param.value,
            created_admin_id: '',
            updated_admin_id: '',
        };
        when(commonCodeRepositoryMock.cFindOne(anything())).thenResolve(dataMock);

        // When
        const commonCode = await commonCodeDetailService.getCommonCode(param.code, param.value);

        // Than
        expect(commonCode).toStrictEqual(dataMock);
    });
});
