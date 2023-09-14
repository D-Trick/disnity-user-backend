// lib
import { Controller, Get } from '@nestjs/common';
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
    async index() {
        const tagNames = await this.tagsService.findNames();

        return tagNames;
    }
}
