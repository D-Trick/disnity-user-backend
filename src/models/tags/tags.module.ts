// lib
import { Module } from '@nestjs/common';
// controllers
import { TagsController } from './tags.controller';
// services
import { TagsService } from './tags.service';

// ----------------------------------------------------------------------

@Module({
    controllers: [TagsController],
    providers: [TagsService],
    exports: [TagsService],
})
export class TagsModule {}
