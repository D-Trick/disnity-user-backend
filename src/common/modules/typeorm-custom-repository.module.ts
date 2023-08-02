// @nestjs
import { SetMetadata, DynamicModule, Provider } from '@nestjs/common';
import { getDataSourceToken } from '@nestjs/typeorm';
// lib
import { DataSource } from 'typeorm';

// ----------------------------------------------------------------------
export const TYPEORM_CUSTOM_REPOSITORY = 'CUSTOM_REPOSITORY';

export function CustomRepository<T>(entity: T): ClassDecorator {
    return SetMetadata(TYPEORM_CUSTOM_REPOSITORY, entity);
}
// ----------------------------------------------------------------------

export class TypeOrmCutomModule {
    public static forCustomRepository<T extends new (...args: any[]) => any>(repositories: T[]): DynamicModule {
        const providers: Provider[] = [];

        for (const repository of repositories) {
            const entity = Reflect.getMetadata(TYPEORM_CUSTOM_REPOSITORY, repository);

            if (!entity) continue;

            providers.push({
                inject: [getDataSourceToken()],
                provide: repository,
                useFactory: (dataSource: DataSource): typeof repository => {
                    const baseRepository = dataSource.getRepository<any>(entity);
                    return new repository(baseRepository.target, baseRepository.manager, baseRepository.queryRunner);
                },
            });
        }

        return {
            exports: providers,
            module: TypeOrmCutomModule,
            providers,
        };
    }
}
