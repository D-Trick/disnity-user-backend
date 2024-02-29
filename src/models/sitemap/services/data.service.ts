// @nestjs
import { Injectable } from '@nestjs/common';
// configs
import { BASE_CONFIG } from '@config/basic.config';
// repositories
import { TagRepository } from '@databases/repositories/tag';
import { GuildRepository } from '@databases/repositories/guild';
import { CommonCodeRepository } from '@databases/repositories/common-code';

// ----------------------------------------------------------------------

@Injectable()
export class SitemapDataService {
    /**************************************************
     * Constructor
     **************************************************/
    constructor(
        private readonly tagRepository: TagRepository,
        private readonly guildRepository: GuildRepository,
        private readonly commonCodeRepository: CommonCodeRepository,
    ) {}

    /**************************************************
     * Public Methods
     **************************************************/
    /**
     * 정적 Url 목록을 위한 URL 가져오기
     */
    getStaticUrls() {
        return [`${BASE_CONFIG.URL}`, `${BASE_CONFIG.URL}/servers/events`, `${BASE_CONFIG.URL}/servers/tags`];
    }

    /**
     * 동적 Url 목록을 위한 URL 가져오기
     */
    async getDynamicUrls() {
        const promise1 = this.tagRepository.findSitemapData();
        const promise2 = this.guildRepository.findSitemapData();
        const promise3 = this.commonCodeRepository.findSitemapData();

        const [tags, servers, categorys] = await Promise.all([promise1, promise2, promise3]);

        return {
            tags,
            servers,
            categorys,
        };
    }
}
