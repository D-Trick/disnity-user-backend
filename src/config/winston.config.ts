// lib
import winston from 'winston';
import winstonDaily from 'winston-daily-rotate-file';
import { utilities as nestWinstonModuleUtilities } from 'nest-winston';
// configs
import { ENV_CONFIG } from './env.config';

// ----------------------------------------------------------------------

const { combine, timestamp, printf, colorize, simple, ms } = winston.format;

const logFormat = (log) => {
    // 에러 레벨 표시
    const level = `${ENV_CONFIG.MODE}.${log?.level}`;

    // 에러 핸들러 표시
    const context = log?.context ? `[${log?.context}]` : '';

    // 에러 메시지 표시
    const message = log?.message;

    // 에러 스택 표시
    const stack = log?.stack ? `\n${log?.stack}` : '';

    return `[${log?.timestamp}] ${level} ${context} ${message}${stack}`;
};

export const PROD_CONFIG = {
    transports: [
        // error 레벨 로그를 저장할 파일 설정
        new winstonDaily({
            format: combine(timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), printf(logFormat)),
            level: 'error',
            datePattern: 'YYYY-MM-DD',
            dirname: 'logs/winston/error',
            filename: `%DATE%.error.log`,
            maxSize: '20m',
            maxFiles: '7d',
            zippedArchive: false,
        }),

        // http 레벨 로그를 저장할 파일 설정
        new winstonDaily({
            format: combine(timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), printf(logFormat)),
            level: 'http',
            datePattern: 'YYYY-MM-DD',
            dirname: 'logs/winston/http',
            filename: `%DATE%.http.log`,
            maxSize: '20m',
            maxFiles: '7d',
            zippedArchive: false,
        }),
    ],
};

export const DEV_CONFIG = {
    format: combine(colorize(), simple()),
    transports: [
        new winston.transports.Console({
            format: combine(
                timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
                ms(),
                nestWinstonModuleUtilities.format.nestLike('DISNITY', { prettyPrint: true }),
            ),
        }),
    ],
};
