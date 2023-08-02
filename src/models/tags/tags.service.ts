// types
import { FindAll } from '@databases/ts/interfaces/tag.interface';
// lib
import { Injectable } from '@nestjs/common';
// repositorys
import { TagRepository } from '@databases/repositories/tag.repository';

// ----------------------------------------------------------------------

@Injectable()
export class TagsService {
    constructor(private readonly tagRepository: TagRepository) {}

    async findAll(): Promise<FindAll[]> {
        const promise = this.tagRepository.findAll();

        return promise;
    }
}
