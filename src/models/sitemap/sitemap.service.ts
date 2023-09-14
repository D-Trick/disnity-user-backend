// lib
import { Injectable } from '@nestjs/common';
// repositories
import { TagRepository } from '@databases/repositories/tag';
import { CommonCodeRepository } from '@databases/repositories/common-code';
import { GuildRepository } from '@databases/repositories/guild';

// ----------------------------------------------------------------------

@Injectable()
export class SitemapService {
    /**************************************************
     * Constructor
     **************************************************/
    constructor(
        private readonly tagRepository: TagRepository,
        private readonly commonCodeRepository: CommonCodeRepository,
        private readonly guildRepository: GuildRepository,
    ) {}

    /**************************************************
     * Public Methods
     **************************************************/
    /**
     * 동적 Url 가져오기
     */
    async getDynamicUrl(): Promise<string[]> {
        const promise1 = this.tagRepository.findSitemapUrls();
        const promise2 = this.guildRepository.findSitemapUrls();
        const promise3 = this.commonCodeRepository.findCategorySitemapUrls();

        const [tags, servers, categorys] = await Promise.all([promise1, promise2, promise3]);

        const categoryUrls = this.urlJsonArrayToArray(categorys);
        const serverUrls = this.urlJsonArrayToArray(servers);
        const tagsUrls = this.urlJsonArrayToArray(tags);

        const sitemap = [].concat(categoryUrls, serverUrls, tagsUrls);

        return sitemap;
    }

    /**************************************************
     * Private Methods
     **************************************************/
    private urlJsonArrayToArray(urlJsonArray: { url: string }[]) {
        const urlArray = [];

        const { length = 0 } = urlJsonArray;
        for (let i = 0; i < length; i++) {
            const json = urlJsonArray[i];

            urlArray.push(json.url);
        }

        return urlArray;
    }
}
