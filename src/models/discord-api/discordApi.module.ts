// lib
import { Module } from '@nestjs/common';
// modules
import { CoreModule } from '@common/modules/core.module';
// services
import { DiscordApiService } from './discordApi.service';

// ----------------------------------------------------------------------

@Module({
    imports: [CoreModule],
    providers: [DiscordApiService],
    exports: [DiscordApiService],
})
export class DiscordApiModule {}
