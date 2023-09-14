// @nestjs
import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
    UnauthorizedException,
    InternalServerErrorException,
    NotFoundException,
    ForbiddenException,
    BadRequestException,
} from '@nestjs/common';
// lib
import { Response } from 'express';
// utils
import { isJson } from '@utils/index';
// messages
import { ERROR_MESSAGES } from '@common/messages';
// exceptions
import { TooManyRequestsException } from './overrides/TooManyRequests.exception';

// ----------------------------------------------------------------------
interface Options {
    defaultMessage: string;
    httpExceptionResponse: string | object;
    defaultResponse: {
        statusCode: number;
        error: string;
    };
}
// ----------------------------------------------------------------------

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const status = exception.getStatus();
        const httpExceptionResponse = exception.getResponse();

        let responseJson = {};
        if (status === HttpStatus.BAD_REQUEST) {
            responseJson = this.exception400Response(httpExceptionResponse);
        } else if (status === HttpStatus.UNAUTHORIZED) {
            responseJson = this.exception401Response(httpExceptionResponse);
        } else if (status === HttpStatus.FORBIDDEN) {
            responseJson = this.exception403Response(httpExceptionResponse);
        } else if (status === HttpStatus.NOT_FOUND) {
            responseJson = this.exception404Response(httpExceptionResponse);
        } else if (status === HttpStatus.TOO_MANY_REQUESTS) {
            responseJson = this.exception429Response(httpExceptionResponse);
        } else if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
            responseJson = this.exception500Response(httpExceptionResponse);
        }

        response.status(status).json(responseJson);
    }

    /*****************
     * 내부사용
     *****************/
    /**
     * HTTP Error Status 400 메시지 처리
     * @param httpExceptionResponse
     * @returns {object}
     */
    private exception400Response(httpExceptionResponse: string | object) {
        const statusExceptionResponse = new BadRequestException();

        return this.getErrorMessage({
            httpExceptionResponse,
            defaultResponse: {
                statusCode: statusExceptionResponse.getStatus(),
                error: statusExceptionResponse.message,
            },
            defaultMessage: ERROR_MESSAGES.E400,
        });
    }

    /**
     * HTTP Error Status 401 메시지 처리
     * @param httpExceptionResponse
     * @returns {object}
     */
    private exception401Response(httpExceptionResponse: string | object) {
        const statusExceptionResponse = new UnauthorizedException();

        return this.getErrorMessage({
            httpExceptionResponse,
            defaultResponse: {
                statusCode: statusExceptionResponse.getStatus(),
                error: statusExceptionResponse.message,
            },
            defaultMessage: ERROR_MESSAGES.E401,
        });
    }

    /**
     * HTTP Error Status 403 메시지 처리
     * @param httpExceptionResponse
     * @returns {object}
     */
    private exception403Response(httpExceptionResponse: string | object) {
        const statusExceptionResponse = new ForbiddenException();

        return this.getErrorMessage({
            httpExceptionResponse,
            defaultResponse: {
                statusCode: statusExceptionResponse.getStatus(),
                error: statusExceptionResponse.message,
            },
            defaultMessage: ERROR_MESSAGES.E403,
        });
    }

    /**
     * HTTP Error Status 404 메시지 처리
     * @param httpExceptionResponse
     * @returns {object}
     */
    private exception404Response(httpExceptionResponse: string | object) {
        const statusExceptionResponse = new NotFoundException();

        return this.getErrorMessage({
            httpExceptionResponse,
            defaultResponse: {
                statusCode: statusExceptionResponse.getStatus(),
                error: statusExceptionResponse.message,
            },
            defaultMessage: ERROR_MESSAGES.E404,
        });
    }

    /**
     * HTTP Error Status 429 메시지 처리
     * @param httpExceptionResponse
     * @returns {object}
     */
    private exception429Response(httpExceptionResponse: string | object) {
        const statusExceptionResponse = new TooManyRequestsException();

        return this.getErrorMessage({
            httpExceptionResponse,
            defaultResponse: {
                statusCode: statusExceptionResponse.getStatus(),
                error: statusExceptionResponse.message,
            },
            defaultMessage: ERROR_MESSAGES.E429,
        });
    }

    /**
     * HTTP Error Status 500 메시지 처리
     * @param httpExceptionResponse
     * @returns {object}
     */
    private exception500Response(httpExceptionResponse: string | object) {
        const statusExceptionResponse = new InternalServerErrorException();

        return this.getErrorMessage({
            httpExceptionResponse,
            defaultResponse: {
                statusCode: statusExceptionResponse.getStatus(),
                error: statusExceptionResponse.message,
            },
            defaultMessage: ERROR_MESSAGES.E500,
        });
    }

    /**
     * 오류 메시지 가져오기
     * @param httpExceptionResponse
     * @returns {object}
     */
    private getErrorMessage({ httpExceptionResponse, defaultResponse, defaultMessage }: Options) {
        let message = '';
        if (typeof httpExceptionResponse === 'string') {
            message = httpExceptionResponse;
        } else if (isJson(httpExceptionResponse)) {
            message = httpExceptionResponse['customMessage'] || httpExceptionResponse['message'] || defaultMessage;

            if (Array.isArray(message)) {
                const errorMessasgeLength = message.length;
                if (errorMessasgeLength > 0) {
                    const errorMessage = message[0];

                    const isInclude = errorMessage.includes('should not exist');
                    message = isInclude ? ERROR_MESSAGES.E900 : errorMessage;
                }
            }
        } else {
            message = defaultMessage;
        }

        const httpExceptionResponseJson = isJson(httpExceptionResponse)
            ? (httpExceptionResponse as unknown as object)
            : {};
        return {
            ...httpExceptionResponseJson,
            ...defaultResponse,
            message,
        };
    }
}
