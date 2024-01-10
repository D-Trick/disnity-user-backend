// @nestjs
import { Controller, Get } from '@nestjs/common';
// utils
import { controllerThrow } from '@utils/response/controller-throw';
// dtos
import { TagNameListResponseDto } from './dtos';
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
            const tags = await this.tagsService.getTagNameAndTotalCount();

            return tags.map((tag) => new TagNameListResponseDto(tag));
        } catch (error: any) {
            controllerThrow(error);
        }
    }
}
