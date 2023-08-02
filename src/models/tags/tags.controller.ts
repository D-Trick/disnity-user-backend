// types
import { FindAll } from '@databases/ts/interfaces/tag.interface';
// lib
import { Controller, Get } from '@nestjs/common';
// services
import { TagsService } from '@models/tags/tags.service';

// ----------------------------------------------------------------------

@Controller()
export class TagsController {
    constructor(private readonly tagsService: TagsService) {}

    @Get()
    async index(): Promise<FindAll[]> {
        const tags = await this.tagsService.findAll();
        return tags;
    }
}
