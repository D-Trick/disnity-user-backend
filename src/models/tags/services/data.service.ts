// @nestjs
import { Injectable } from '@nestjs/common';
// repositories
import { TagRepository } from '@databases/repositories/tag';

// ----------------------------------------------------------------------

@Injectable()
export class TagsDataService {
    /**************************************************
     * Constructor
     **************************************************/
    constructor(private readonly tagRepository: TagRepository) {}

    /**************************************************
     * Public Methods
     **************************************************/
    /**
     * 전체태그(태그명 마다 총 개수) 목록을 가져온다.
     */
    async getAllTags() {
        return await this.tagRepository.findAllTags();
    }
}
