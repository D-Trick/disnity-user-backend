// @nestjs
import { Injectable } from '@nestjs/common';
// services
import { TagsDataService } from './services/data.service';

// ----------------------------------------------------------------------

@Injectable()
export class TagsService {
    /**************************************************
     * Constructor
     **************************************************/
    constructor(private readonly dataServices: TagsDataService) {}

    /**************************************************
     * Public Methods
     **************************************************/
    /******************************
     * dataServices
     ******************************/
    /**
     * 태그이름(총합계) 목록을 가져온다.
     */
    async getTagNameAndTotalCount() {
        return await this.dataServices.getTagNameAndTotalCount();
    }
}
