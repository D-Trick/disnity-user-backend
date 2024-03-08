// types
import type { TypeOrmModuleOptions } from '@nestjs/typeorm/dist/interfaces/index';
// configs
import { ENV_CONFIG } from './env.config';

// ----------------------------------------------------------------------

export const MYSQL_CONFIG: TypeOrmModuleOptions = {
    type: 'mysql',
    host: ENV_CONFIG.DATABASE_HOST,
    port: 3306,
    username: ENV_CONFIG.DATABASE_USERNAME,
    password: ENV_CONFIG.DATABASE_PASSWORD,
    database: 'disnity',
    entities: ['dist/**/*.entity{.ts,.js}'],
    autoLoadEntities: true,
    synchronize: false, // 절대 건들이지말것 true로 변경시 실제 DB에 동기화시킨다. (개발에서만 사용)

    timezone: 'local',

    extra: {
        connectionLimit: 20,
        supportBigNumbers: true,
        bigNumberStrings: true,
    },

    /**
     * query - 모든 쿼리를 기록합니다.
     * schema - 스키마 빌드 프로세스를 기록합니다.
     * warn - 내부 orm 경고를 기록합니다.
     * error - 실패한 모든 쿼리 및 오류를 기록합니다.
     * info - 내부 orm 정보 메시지를 기록합니다.
     * log - 내부 orm 로그 메시지를 기록합니다.
     * all: 전체 ex) logging: 'all'
     */
    logging: ['error'],
    maxQueryExecutionTime: 1000 * 7, // 7초이상 걸리는 쿼리를 기록한다.
} as const;
