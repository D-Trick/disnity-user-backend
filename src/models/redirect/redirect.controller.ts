// lib
import { Controller, Get, Response, Param, Query, UseGuards, Request, Logger } from '@nestjs/common';
// configs
import { discordConfig, DISCORD_INVITE_URL } from '@config/discord.config';
// guards
import { LoginCheckGuard } from '@guards/login-check.guard';
// dtos
import { ParamIdStringDto, ParamTypeAndGuildIdDto } from '@common/dtos';
import { RedirectQueryDto } from './dtos/routers/querys.dto';
// repositories
import { GuildRepository } from '@databases/repositories/guild';

// ----------------------------------------------------------------------
const { BOT_INVITE_REDIRECT_CREATE_URI, BOT_INVITE_REDIRECT_MYPAGE_URI } = discordConfig;
// ----------------------------------------------------------------------

@Controller()
export class RedirectController {
    private readonly logger = new Logger(RedirectController.name);

    /**************************************************
     * Constructor
     **************************************************/
    constructor(private readonly guildRepository: GuildRepository) {}

    /**************************************************
     * Public Methods
     **************************************************/
    @Get('bot-add/:type/:guildId')
    async botAddTypeGuildId(@Response() res, @Param() param: ParamTypeAndGuildIdDto) {
        const { type, guildId } = param;

        switch (type) {
            case 'create':
                return res.redirect(`${BOT_INVITE_REDIRECT_CREATE_URI}&guild_id=${guildId}`);

            case 'mypage':
                return res.redirect(`${BOT_INVITE_REDIRECT_MYPAGE_URI}&guild_id=${guildId}`);

            default:
                return res.redirect('back');
        }
    }

    @Get('bot-add/callback')
    @UseGuards(LoginCheckGuard)
    async botAddCallback(@Request() req, @Response() res, @Query() query: RedirectQueryDto) {
        if (!req.user?.isLogin) return res.redirect('/auth/login');

        const { redirect, guild_id, error } = query;

        switch (redirect) {
            case 'create':
                const redirectUrl =
                    error === 'access_denied'
                        ? `/servers/${guild_id}/create`
                        : `/servers/${guild_id}/create?botAdded=true`;

                return res.redirect(redirectUrl);

            case 'mypage':
                try {
                    await this.guildRepository.cUpdate({
                        values: {
                            is_bot: 1,
                        },
                        where: {
                            id: guild_id,
                        },
                    });

                    return res.redirect(`/mypage/servers`);
                } catch (error: any) {
                    this.logger.error(error.message, error.stack);

                    return res.redirect(`/mypage/servers`);
                }

            default:
                return res.redirect(`/`);
        }
    }

    @Get('invite/:id')
    async inviteId(@Response() res, @Param() param: ParamIdStringDto) {
        const { id } = param;

        const server = await this.guildRepository.selectOne({
            select: {
                columns: {
                    invite_code: true,
                },
            },
            where: {
                id,
            },
        });

        if (server) {
            return res.redirect(`${DISCORD_INVITE_URL}/${server.invite_code}`);
        }

        return res.redirect('back');
    }
}
