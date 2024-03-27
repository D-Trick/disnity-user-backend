// types
import { FindAllTags } from '@databases/types/tag.type';
// test
import { Test } from '@nestjs/testing';
import { mock, instance, when } from 'ts-mockito';
// services
import { TagsListService } from '@models/tags/services/list.service';
// repositories
import { TagRepository } from '@databases/repositories/tag';

// ----------------------------------------------------------------------

describe('TagsListService', () => {
    let tagsListService: TagsListService;

    const tagRepositoryMock: TagRepository = mock(TagRepository);

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            providers: [TagsListService, { provide: TagRepository, useValue: instance(tagRepositoryMock) }],
        }).compile();

        tagsListService = moduleRef.get<TagsListService>(TagsListService);
    });

    describe('getAllTags', () => {
        it('전체태그를 조회한다', async () => {
            // Given
            const dataMock: FindAllTags[] = [
                {
                    name: '태그명',
                    total: '9',
                },
            ];

            when(tagRepositoryMock.findAllTags()).thenResolve(dataMock);

            // When
            const allTags = await tagsListService.getAllTags();

            // Than
            expect(allTags[0]).toStrictEqual(dataMock[0]);
        });
    });
});
