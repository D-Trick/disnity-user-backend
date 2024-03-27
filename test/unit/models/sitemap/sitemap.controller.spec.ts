// test
import { Test } from '@nestjs/testing';
import { mock, instance, when } from 'ts-mockito';
// configs
import { BASE_CONFIG } from '@config/basic.config';
// dtos
import { DisnitySitemapResponseDto } from '@models/sitemap/dtos/disnity-sitemap-response.dto';
// controllers
import { SitemapController } from '@models/sitemap/sitemap.controller';
// services
import { SitemapListService } from '@models/sitemap/services/list.service';

// ----------------------------------------------------------------------

describe('SitemapController 테스트를 시작합니다', () => {
    let sitemapController: SitemapController;

    const sitemapListServiceMock: SitemapListService = mock(SitemapListService);

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            controllers: [SitemapController],
            providers: [{ provide: SitemapListService, useValue: instance(sitemapListServiceMock) }],
        }).compile();

        sitemapController = moduleRef.get<SitemapController>(SitemapController);
    });

    describe('disnitySitemap', () => {
        it(`디스니티의 사이트맵을 조회한다`, async () => {
            // Given
            const dataMock1 = [
                `${BASE_CONFIG.URL}`,
                `${BASE_CONFIG.URL}/servers/events`,
                `${BASE_CONFIG.URL}/servers/tags`,
            ];
            const dataMock2 = {
                tags: [],
                servers: [],
                categorys: [],
            };

            when(sitemapListServiceMock.getStaticUrls()).thenReturn(dataMock1);
            when(sitemapListServiceMock.getDynamicUrls()).thenResolve(dataMock2);

            // When
            const sitemap = await sitemapController.disnitySitemap();

            // Than
            expect(sitemap).toStrictEqual(new DisnitySitemapResponseDto(dataMock1, dataMock2));
        });
    });
});
