// @nestjs
import { Module } from '@nestjs/common';
// controllers
import { TagsController } from './tags.controller';
// services
import { TagsService } from './tags.service';
import { TagsDataService } from './services/data.service';

// ----------------------------------------------------------------------

@Module({
    controllers: [TagsController],
    providers: [TagsService, TagsDataService],
    exports: [TagsService],
})
export class TagsModule {}
