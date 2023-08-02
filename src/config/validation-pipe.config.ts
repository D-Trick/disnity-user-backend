// @nestjs
import { ValidationPipeOptions } from '@nestjs/common';
// configs
import { ENV_CONFIG } from './env.config';

// ----------------------------------------------------------------------

export const validationPipeConfig: ValidationPipeOptions = {
    enableDebugMessages: ENV_CONFIG.IS_DEV_MODE ? true : false,
    stopAtFirstError: true,
    transform: true,
    transformOptions: {
        enableImplicitConversion: true,
    },
    whitelist: true,
    forbidNonWhitelisted: true,
};
