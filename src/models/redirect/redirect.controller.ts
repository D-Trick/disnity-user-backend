// types
import type { Response as ExpressResponse } from 'express';
// @nestjs
import { Controller, Get, Response, Param, Query, Logger, UseGuards } from '@nestjs/common';
// configs
import { DISCORD_CONFIG } from '@config/discord.config';
// decorators
import { AuthUser } from '@decorators/auth-user.decorator';
// dtos
import { AuthUserDto } from '@models/auth/dtos/auth-user.dto';
import { DiscordCallbackRequestDto } from './dtos/index';
import { ParamIdStringRequestDto, ParamTypeAndGuildIdRequestDto } from '@common/dtos';
// guards
import { AuthGuardLoginCheck } from '@guards/login-check.guard';
// repositories
import { GuildRepository } from '@databases/repositories/guild';

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
    async botAdd(@Response() res: ExpressResponse, @Param() param: ParamTypeAndGuildIdRequestDto) {
        const { type, guildId } = param;

        switch (type) {
            case 'create':
            case 'mypage':
                return res.redirect(DISCORD_CONFIG.BOT_INVITE_URL(type, guildId));

            default:
                return res.redirect('back');
        }
    }

    @Get('bot-add/callback')
    @UseGuards(AuthGuardLoginCheck)
    async botAddCallback(
        @AuthUser() user: AuthUserDto,
        @Response() res: ExpressResponse,
        @Query() query: DiscordCallbackRequestDto,
    ) {
        const { redirect, guild_id, error } = query;

        if (!user.isLogin) {
            return res.redirect('/auth/login');
        }

        switch (redirect) {
            case 'create':
                const isAccessDenied = error === 'access_denied';
                if (isAccessDenied) {
                    return res.redirect('/mypage/servers/create');
                } else {
                    return res.redirect(`/servers/${guild_id}/create?botAdded=true`);
                }

            case 'mypage':
                try {
                    if (!!guild_id) {
                        await this.guildRepository.cUpdate({
                            values: {
                                is_bot: 1,
                            },
                            where: {
                                id: guild_id,
                            },
                        });
                    }

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
    async inviteId(@Response() res: ExpressResponse, @Param() param: ParamIdStringRequestDto) {
        const { id } = param;

        const server = await this.guildRepository.cFindOne({
            select: {
                invite_code: true,
            },
            where: {
                id,
            },
        });

        if (server) {
            return res.redirect(DISCORD_CONFIG.SERVER_INVITE_URL(server.invite_code));
        }

        return res.redirect('back');
    }
}
