// lib
import { Injectable } from '@nestjs/common';
// repositorys
import { TagRepository } from '@databases/repositories/tag.repository';
import { CommonCodeRepository } from '@databases/repositories/common-code.repository';
import { GuildRepository } from '@databases/repositories/guild.repository';

// ----------------------------------------------------------------------

@Injectable()
export class SitemapService {
    constructor(
        private readonly tagRepository: TagRepository,
        private readonly commonCodeRepository: CommonCodeRepository,
        private readonly guildRepository: GuildRepository,
    ) {}

    /**
     * 공통코드 가져오기
     * @param code
     */
    async getDynamicUrl(): Promise<string[]> {
        const promises = [];

        promises.push(this.tagRepository.getTagUrls());
        promises.push(this.guildRepository.getServerUrls());
        promises.push(this.commonCodeRepository.getCategoryUrls());

        const [tagsUrls, serverUrls, categoryUrls] = await Promise.all(promises);

        const sitemap = [].concat(categoryUrls, serverUrls, tagsUrls);
        return sitemap;
    }
}
