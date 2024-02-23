// test
import { Test } from '@nestjs/testing';
import { mock, instance, when, anything } from 'ts-mockito';
// services
import { CommonCodeDataService } from '@models/common-code/services/data.service';
// entities
import { CommonCode } from '@databases/entities/common-code.entity';
// repositories
import { CommonCodeRepository } from '@databases/repositories/common-code';

// ----------------------------------------------------------------------

describe('CommonCodeDataService 테스트를 시작합니다.', () => {
    let commonCodeDataService: CommonCodeDataService;

    const commonCodeRepositoryMock: CommonCodeRepository = mock(CommonCodeRepository);

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            providers: [
                CommonCodeDataService,
                { provide: CommonCodeRepository, useValue: instance(commonCodeRepositoryMock) },
            ],
        }).compile();

        commonCodeDataService = moduleRef.get<CommonCodeDataService>(CommonCodeDataService);
    });

    it(`공통코드를 목록을 조회합니다.`, async () => {
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
        when(commonCodeRepositoryMock.cFind(anything())).thenResolve(dataMock);

        // When
        const commonCodes = await commonCodeDataService.getCommonCodes(param.code);

        // Than
        expect(commonCodes[0]).toStrictEqual(dataMock[0]);
    });
});
