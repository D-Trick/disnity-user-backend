// types
import { FindAllTags } from '@databases/types/tag.type';
// test
import { Test } from '@nestjs/testing';
import { mock, instance, when } from 'ts-mockito';
// dtos
import { AllTagListResponseDto } from '@models/tags/dtos';
// controllers
import { TagsController } from '@models/tags/tags.controller';
// services
import { TagsListService } from '@models/tags/services/list.service';

// ----------------------------------------------------------------------

describe('TagsController', () => {
    let tagsController: TagsController;

    const tagsListServiceMock: TagsListService = mock(TagsListService);

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            controllers: [TagsController],
            providers: [{ provide: TagsListService, useValue: instance(tagsListServiceMock) }],
        }).compile();

        tagsController = moduleRef.get<TagsController>(TagsController);
    });

    describe('allTagList', () => {
        it('전체태그 목록을 조회한다', async () => {
            // Given
            const dataMock: FindAllTags[] = [
                {
                    name: '태그명',
                    total: '9',
                },
            ];

            when(tagsListServiceMock.getAllTags()).thenResolve(dataMock);

            // When
            const allTags = await tagsController.allTagList();

            // Than
            expect(allTags[0]).toStrictEqual(new AllTagListResponseDto(dataMock[0]));
        });
    });
});
