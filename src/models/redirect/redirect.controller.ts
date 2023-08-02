// lib
import { Controller, Get, Response, Param, Query, UseGuards, Request } from '@nestjs/common';
// configs
import { discordConfig, DISCORD_INVITE_URL } from '@config/discord.config';
// guards
import { LoginCheckGuard } from '@guards/login-check.guard';
// services
import { ServersService } from '@models/servers/servers.service';
// repositories
import { GuildRepository } from '@databases/repositories/guild.repository';

// ----------------------------------------------------------------------
const { BOT_INVITE_REDIRECT_CREATE_URI, BOT_INVITE_REDIRECT_MYPAGE_URI } = discordConfig;
// ----------------------------------------------------------------------

@Controller()
export class RedirectController {
    constructor(
        private readonly serversService: ServersService,

        private readonly guildRepository: GuildRepository,
    ) {}

    @Get('bot-add/:type/:guildId')
    @UseGuards(LoginCheckGuard)
    async botAddCreate(@Request() req, @Response() res, @Param() param) {
        if (!req.user?.isLogin) return res.redirect('/auth/login');

        const { type, guildId } = param;

        let redriectUrl = 'back';
        if (type === 'create') {
            redriectUrl = `${BOT_INVITE_REDIRECT_CREATE_URI}&guild_id=${guildId}`;
        } else if (type === 'mypage') {
            redriectUrl = `${BOT_INVITE_REDIRECT_MYPAGE_URI}&guild_id=${guildId}`;
        } else {
            redriectUrl = 'back';
        }

        return res.redirect(redriectUrl);
    }

    @Get('bot-add/callback')
    @UseGuards(LoginCheckGuard)
    async botAddCallback(@Request() req, @Response() res, @Query() query) {
        if (!req.user?.isLogin) return res.redirect('/auth/login');

        const { redirect, guild_id: guildId, error } = query;

        if (redirect === 'create') {
            if (error === 'access_denied') return res.redirect(`/servers/create`);

            return res.redirect(`/servers/${guildId}/create?botAdded=true`);
        } else if (redirect === 'mypage') {
            try {
                await this.serversService.update({
                    values: {
                        is_bot: 1,
                    },
                    where: {
                        guild_id: guildId,
                    },
                });

                return res.redirect(`/mypage/servers`);
            } catch (error) {
                return res.redirect(`/mypage/servers`);
            }
        }

        return res.redirect(`/`);
    }

    @Get('invite/:id')
    async invite(@Response() res, @Param() param) {
        const { id } = param;

        const server = await this.guildRepository.selectOne({
            where: {
                id,
            },
        });

        if (server) {
            return res.redirect(`${DISCORD_INVITE_URL}/${server.invite_code}`);
        } else {
            return res.redirect('back');
        }
    }
}
