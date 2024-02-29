// lib
import { Exclude, Expose } from 'class-transformer';
// configs
import { BASE_CONFIG } from '@config/basic.config';
// entities
import { Tag } from '@databases/entities/tag.entity';
import { Guild } from '@databases/entities/guild.entity';
import { CommonCode } from '@databases/entities/common-code.entity';

// ----------------------------------------------------------------------
interface DynamicUrls {
    tags: Pick<Tag, 'name'>[];
    servers: Pick<Guild, 'id'>[];
    categorys: Pick<CommonCode, 'value'>[];
}
// ----------------------------------------------------------------------

export class DisnitySitemapResponseDto {
    @Exclude() private readonly _urls: string[];

    constructor(staticUrls: string[], dynamicUrls: DynamicUrls) {
        const tagUrls = dynamicUrls.tags.map((tag) => `${BASE_CONFIG.URL}/servers/tags/${tag.name}`);
        const serverUrls = dynamicUrls.servers.map((server) => `${BASE_CONFIG.URL}/servers/${server.id}`);
        const categorysUrls = dynamicUrls.categorys.map((category) => {
            if (category.value === 'all') {
                return `${BASE_CONFIG.URL}/servers`;
            }

            return `${BASE_CONFIG.URL}/servers/categorys/${category.value}`;
        });

        this._urls = [].concat(staticUrls, categorysUrls, serverUrls, tagUrls);
    }

    @Expose()
    get urls() {
        return this._urls;
    }
}
