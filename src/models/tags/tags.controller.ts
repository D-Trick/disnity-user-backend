// @nestjs
import { Controller, Get } from '@nestjs/common';
// utils
import { controllerThrow } from '@utils/response/controller-throw';
// services
import { TagsService } from '@models/tags/tags.service';

// ----------------------------------------------------------------------

@Controller()
export class TagsController {
    /**************************************************
     * Constructor
     **************************************************/
    constructor(private readonly tagsService: TagsService) {}

    /**************************************************
     * Public Methods
     **************************************************/
    @Get()
    async tagNamesAndTotalCountList() {
        try {
            const tagNames = await this.tagsService.getTagNameAndTotalCount();

            return tagNames;
        } catch (error: any) {
            controllerThrow(error);
        }
    }
}
