// @nestjs
import { Module } from '@nestjs/common';
// controllers
import { TagsController } from './tags.controller';
// services
import { TagsListService } from './services/list.service';

// ----------------------------------------------------------------------

@Module({
    controllers: [TagsController],
    providers: [TagsListService],
    exports: [TagsListService],
})
export class TagsModule {}
