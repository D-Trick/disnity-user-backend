// lib
import { Module } from '@nestjs/common';
// modules
import { CoreModule } from '@common/modules/core.module';
import { ServersModule } from '@models/servers/servers.module';
// controllers
import { SearchController } from './search.controller';

// ----------------------------------------------------------------------

@Module({
    imports: [CoreModule, ServersModule],
    controllers: [SearchController],
})
export class SearchModule {}
