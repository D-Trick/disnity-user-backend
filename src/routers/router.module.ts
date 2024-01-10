// @nestjs
import { Module } from '@nestjs/common';
import { RouterModule as _RouterModule } from '@nestjs/core';
// routes
import apiRouter from '@routers/api.route';
import authRouter from '@routers/auth.route';
import redirect from '@routers/redirect.route';

// ----------------------------------------------------------------------

@Module({
    imports: [_RouterModule.register([apiRouter, authRouter, redirect])],
})
export class RouterModule {}
