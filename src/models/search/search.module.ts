// @nestjs
import { Module } from '@nestjs/common';
// modules
import { ServersModule } from '@models/servers/servers.module';
// controllers
import { SearchController } from './search.controller';

// ----------------------------------------------------------------------

@Module({
    imports: [ServersModule],
    controllers: [SearchController],
})
export class SearchModule {}
