// test
import { Test } from '@nestjs/testing';
import { mock, instance, when } from 'ts-mockito';
// configs
import { BASE_CONFIG } from '@config/basic.config';
// services
import { SitemapListService } from '@models/sitemap/services/list.service';
// repositories
import { TagRepository } from '@databases/repositories/tag';
import { GuildRepository } from '@databases/repositories/guild';
import { CommonCodeRepository } from '@databases/repositories/common-code';

// ----------------------------------------------------------------------

describe('SitemapListService 테스트를 시작합니다', () => {
    let sitemapListService: SitemapListService;

    const tagRepositoryMock: TagRepository = mock(TagRepository);
    const guildRepositoryMock: GuildRepository = mock(GuildRepository);
    const commonCodeRepositoryMock: CommonCodeRepository = mock(CommonCodeRepository);

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            providers: [
                SitemapListService,
                { provide: TagRepository, useValue: instance(tagRepositoryMock) },
                { provide: GuildRepository, useValue: instance(guildRepositoryMock) },
                { provide: CommonCodeRepository, useValue: instance(commonCodeRepositoryMock) },
            ],
        }).compile();

        sitemapListService = moduleRef.get<SitemapListService>(SitemapListService);
    });

    it(`정적 URL을 조회한다`, async () => {
        // Given
        const dataMock = [`${BASE_CONFIG.URL}`, `${BASE_CONFIG.URL}/servers/events`, `${BASE_CONFIG.URL}/servers/tags`];

        // When
        const staticUrls = sitemapListService.getStaticUrls();

        // Than
        expect(staticUrls).toStrictEqual(dataMock);
    });

    it(`동적 URL을 조회한다`, async () => {
        // Given
        const dataMock1 = [
            {
                name: '태그명',
            },
        ];
        const dataMock2 = [
            {
                id: '1',
            },
        ];
        const dataMock3 = [
            {
                value: '카테고리',
            },
        ];

        when(tagRepositoryMock.findSitemapData()).thenResolve(dataMock1);
        when(guildRepositoryMock.findSitemapData()).thenResolve(dataMock2);
        when(commonCodeRepositoryMock.findSitemapData()).thenResolve(dataMock3);

        // When
        const dynamicUrls = await sitemapListService.getDynamicUrls();

        // Than
        expect(dynamicUrls).toStrictEqual({
            tags: dataMock1,
            servers: dataMock2,
            categorys: dataMock3,
        });
    });
});
