// @nestjs
import { BadRequestException, ValidationError, ValidationPipeOptions } from '@nestjs/common';
// lodash
import isEmpty from 'lodash/isEmpty';
// configs
import { ENV_CONFIG } from './env.config';
// messages
import { COMMON_ERROR_MESSAGES } from '@common/messages';

// ----------------------------------------------------------------------

export const VALIDATION_PIPE_CONFIG: ValidationPipeOptions = {
    enableDebugMessages: ENV_CONFIG.IS_DEV_MODE ? true : false,
    stopAtFirstError: true,
    transform: true,
    transformOptions: {
        enableImplicitConversion: true,
    },
    whitelist: true,
    forbidNonWhitelisted: true,

    exceptionFactory: (validationErrors: ValidationError[] = []) => {
        try {
            const message = getErrorMessage(validationErrors);

            return new BadRequestException(message);
        } catch (error) {
            return error;
        }
    },
} as const;

// ----------------------------------------------------------------------

/**
 * 유효성 검사에서 실패한 메시지 가져오기
 * @param {ValidationError[]} validationErrors
 */
function getErrorMessage(validationErrors: ValidationError[] = []) {
    const { length } = validationErrors;
    for (let i = 0; i < length; i++) {
        const error = validationErrors[i];

        if (isEmpty(error.children)) {
            const message = Object.values(error.constraints)[0];

            if (message.includes('should not exist')) {
                return COMMON_ERROR_MESSAGES.NOT_ALLOWED_REQUEST;
            }

            return message;
        }

        return getErrorMessage(error.children);
    }
}
