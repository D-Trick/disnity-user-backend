// lib
import { Injectable } from '@nestjs/common';
// repositories
import { TagRepository } from '@databases/repositories/tag';

// ----------------------------------------------------------------------

@Injectable()
export class TagsService {
    /**************************************************
     * Constructor
     **************************************************/
    constructor(private readonly tagRepository: TagRepository) {}

    /**************************************************
     * Public Methods
     **************************************************/
    async findNames() {
        const promise = this.tagRepository.findNames();

        return promise;
    }
}
