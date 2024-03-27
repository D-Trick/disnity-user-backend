// test
import { Test } from '@nestjs/testing';
import { mock, instance, when, anything } from 'ts-mockito';
// services
import { CommonCodeListService } from '@models/common-code/services/list.service';
// entities
import { CommonCode } from '@databases/entities/common-code.entity';
// repositories
import { CommonCodeRepository } from '@databases/repositories/common-code';

// ----------------------------------------------------------------------

describe('CommonCodeListService', () => {
    let commonCodeListService: CommonCodeListService;

    const commonCodeRepositoryMock: CommonCodeRepository = mock(CommonCodeRepository);

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            providers: [
                CommonCodeListService,
                { provide: CommonCodeRepository, useValue: instance(commonCodeRepositoryMock) },
            ],
        }).compile();

        commonCodeListService = moduleRef.get<CommonCodeListService>(CommonCodeListService);
    });

    describe('getCommonCodes', () => {
        it(`공통코드를 목록을 조회한다`, async () => {
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
            const commonCodes = await commonCodeListService.getCommonCodes(param.code);

            // Than
            expect(commonCodes[0]).toStrictEqual(dataMock[0]);
        });
    });
});
