// @nextjs
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
// lib
import { createLogger } from 'winston';
import cookieParser from 'cookie-parser';
// exceptions
import { HttpExceptionFilter } from '@exceptions/http.exception';
// configs
import { ENV_CONFIG } from '@config/env.config';
import { cookieConfig } from '@config/cookie.config';
import { prodConfig, devConfig } from '@config/winston.config';
import { validationPipeConfig } from '@config/validation-pipe.config';
// modules
import { AppModule } from './app.module';
// loggers
import { WinstonLogger } from './logger/winston.service';

// ----------------------------------------------------------------------
let isDisableKeepAlive = false;
// ----------------------------------------------------------------------

async function bootstrap() {
    const winstonService = new WinstonLogger(createLogger(ENV_CONFIG.IS_PROD_MODE ? prodConfig : devConfig));

    // 서버생성
    const app = await NestFactory.create(AppModule, {
        logger: winstonService,
    });

    // PM2 프로세스 종료시 기존 연결 전부 close
    app.use((req, res, next) => {
        if (isDisableKeepAlive) res.set('Connection', 'close');
        next();
    });

    // 글로벌설정
    app.use(cookieParser(cookieConfig.secret));

    app.useGlobalPipes(new ValidationPipe(validationPipeConfig));
    app.useGlobalFilters(new HttpExceptionFilter());

    // 서버실행
    try {
        const PORT = process.env.PORT || 5002;
        await app.listen(PORT, '0.0.0.0');

        winstonService.log('================================');
        winstonService.log(`    DISNITY API Server(${ENV_CONFIG.IS_PROD_MODE ? 'PROD' : 'DEV'})`);
        winstonService.log(`    PORT : ${PORT}`);
        winstonService.log('================================');

        if (process.send) {
            process.send('ready');
            winstonService.log(`[+] PM2 Ready`);
        }
    } catch (error: any) {
        winstonService.error(error);
    }

    // 프로세스 종료 시
    process.on('SIGINT', () => {
        winstonService.log(`[*] SIGINT Event`);

        isDisableKeepAlive = true;

        app.close()
            .then(() => {
                winstonService.log(`[+] Server Close`);

                process.exit(0);
            })
            .catch((error: any) => {
                winstonService.error(error);

                process.exit(1);
            });
    });
}
bootstrap();
