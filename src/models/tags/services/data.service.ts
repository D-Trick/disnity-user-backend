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
     * 태그이름(총합계) 목록을 가져온다.
     */
    async getTagNameAndTotalCount() {
        return await this.tagRepository.findNames();
    }
}
