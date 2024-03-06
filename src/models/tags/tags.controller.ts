// @nestjs
import { Controller, Get } from '@nestjs/common';
// utils
import { ControllerException } from '@utils/response';
// dtos
import { AllTagListResponseDto } from './dtos';
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
    async allTagList() {
        try {
            const allTags = await this.tagsService.getAllTags();

            return allTags.map((tag) => new AllTagListResponseDto(tag));
        } catch (error: any) {
            throw new ControllerException(error);
        }
    }
}
