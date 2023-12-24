// @nextjs
import { NestFactory } from '@nestjs/core';
// lib
import { createLogger } from 'winston';
// configs
import { ENV_CONFIG } from '@config/env.config';
import { prodConfig, devConfig } from '@config/winston.config';
// modules
import { AppModule } from './app.module';
// loggers
import { WinstonLogger } from './lib/logger/winston-logger';
// common
import { nestAppSetting } from '@common/app/nest-app-setting';

// ----------------------------------------------------------------------
let isDisableKeepAlive = false;
// ----------------------------------------------------------------------

async function bootstrap() {
    const winstonLogger = new WinstonLogger(createLogger(ENV_CONFIG.IS_PROD_MODE ? prodConfig : devConfig));

    const app = await NestFactory.create(AppModule, {
        logger: winstonLogger,
    });

    // PM2 프로세스 종료시 기존 연결 전부 close
    app.use((req, res, next) => {
        if (isDisableKeepAlive) {
            res.set('Connection', 'close');
        }
        next();
    });

    nestAppSetting(app);

    // 서버실행
    try {
        const PORT = process.env.PORT || 5002;
        await app.listen(PORT, '0.0.0.0');

        winstonLogger.log('================================');
        winstonLogger.log(`    DISNITY API Server(${ENV_CONFIG.IS_PROD_MODE ? 'PROD' : 'DEV'})`);
        winstonLogger.log(`    PORT : ${PORT}`);
        winstonLogger.log('================================');

        if (process.send) {
            process.send('ready');
            winstonLogger.log(`[+] PM2 Ready`);
        }
    } catch (error: any) {
        winstonLogger.error(error.message, error.stack);
    }

    // 프로세스 종료 시
    process.on('SIGINT', () => {
        (async () => {
            winstonLogger.log(`[*] SIGINT Event`);

            isDisableKeepAlive = true;

            try {
                await app.close();
                winstonLogger.log(`[+] Server Close`);

                process.exit(0);
            } catch (error: any) {
                winstonLogger.error(error.message, error.stack);

                process.exit(1);
            }
        })();
    });
}
bootstrap();
