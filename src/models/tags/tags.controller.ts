// @nestjs
import { Controller, Get } from '@nestjs/common';
// utils
import { ControllerException } from '@utils/response';
// dtos
import { AllTagListResponseDto } from './dtos';
// services
import { TagsListService } from '@models/tags/services/list.service';

// ----------------------------------------------------------------------

@Controller()
export class TagsController {
    /**************************************************
     * Constructor
     **************************************************/
    constructor(private readonly tagsListService: TagsListService) {}

    /**************************************************
     * Public Methods
     **************************************************/
    @Get()
    async allTagList() {
        try {
            const allTags = await this.tagsListService.getAllTags();

            return allTags.map((tag) => new AllTagListResponseDto(tag));
        } catch (error: any) {
            throw new ControllerException(error);
        }
    }
}
