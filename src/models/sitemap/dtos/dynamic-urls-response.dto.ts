// lib
import { Exclude, Expose } from 'class-transformer';
// configs
import { baseConfig } from '@config/basic.config';
// entities
import { Tag } from '@databases/entities/tag.entity';
import { Guild } from '@databases/entities/guild.entity';
import { CommonCode } from '@databases/entities/common-code.entity';

// ----------------------------------------------------------------------
interface DynamicData {
    tags: Pick<Tag, 'name'>[];
    servers: Pick<Guild, 'id'>[];
    categorys: Pick<CommonCode, 'value'>[];
}
// ----------------------------------------------------------------------

export class DynamicUrlsResponseDto {
    @Exclude() private readonly _urls: string[];

    constructor(dynamicData: DynamicData) {
        const tagUrls = dynamicData.tags.map((tag) => `${baseConfig.url}/servers/tags/${tag.name}`);
        const serverUrls = dynamicData.servers.map((server) => `${baseConfig.url}/servers/${server.id}`);
        const categorysUrls = dynamicData.categorys.map((category) => {
            if (category.value === 'all') {
                return `${baseConfig.url}/servers`;
            }

            return `${baseConfig.url}/servers/categorys/${category.value}`;
        });

        this._urls = [].concat(categorysUrls, serverUrls, tagUrls);
    }

    @Expose()
    get urls() {
        return this._urls;
    }
}
