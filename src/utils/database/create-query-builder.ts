// types
import type {
    QueryRunner,
    Repository,
    SelectQueryBuilder,
    EntityTarget,
    ObjectLiteral,
    InsertQueryBuilder,
    UpdateQueryBuilder,
    DeleteQueryBuilder,
} from 'typeorm';

/**************************************************/
interface Connection<T> {
    repository: Repository<T>;
    transaction?: QueryRunner;
}
/**************************************************/
/**
 * CreateSelectQueryBuilder
 * @param entity
 * @param tableAlias
 * @param connection
 * @returns SelectQueryBuilder
 */
export function createSelectQueryBuilder<Entity extends ObjectLiteral>(
    entity: EntityTarget<Entity>,
    tableAlias: string,
    connection: Connection<Entity>,
): SelectQueryBuilder<Entity> {
    const { repository, transaction } = connection;

    const queryBuilder = transaction
        ? transaction.manager.createQueryBuilder<Entity>(entity, tableAlias, transaction)
        : repository.createQueryBuilder(tableAlias);

    return queryBuilder;
}
/**
 * CreateInsertQueryBuilder
 * @param entity
 * @param tableAlias
 * @param connection
 * @returns InsertQueryBuilder
 */
export function createInsertQueryBuilder<Entity extends ObjectLiteral>(
    entity: EntityTarget<Entity>,
    tableAlias: string,
    connection: Connection<Entity>,
): InsertQueryBuilder<Entity> {
    const { repository, transaction } = connection;

    const queryBuilder = transaction
        ? transaction.manager.createQueryBuilder<Entity>(entity, tableAlias, transaction).insert()
        : repository.createQueryBuilder(tableAlias).insert();

    return queryBuilder;
}

/**
 * CreateUpdateQueryBuilder
 * @param entity
 * @param tableAlias
 * @param connection
 * @returns UpdateQueryBuilder
 */
export function createUpdateQueryBuilder<Entity extends ObjectLiteral>(
    entity: EntityTarget<Entity>,
    tableAlias: string,
    connection: Connection<Entity>,
): UpdateQueryBuilder<Entity> {
    const { repository, transaction } = connection;

    const queryBuilder = transaction
        ? transaction.manager.createQueryBuilder<Entity>(entity, tableAlias, transaction).update()
        : repository.createQueryBuilder(tableAlias).update();

    return queryBuilder;
}

/**
 * CreateDeleteQueryBuilder
 * @param entity
 * @param tableAlias
 * @param connection
 * @returns DeleteQueryBuilder
 */
export function createDeleteQueryBuilder<Entity extends ObjectLiteral>(
    entity: EntityTarget<Entity>,
    tableAlias: string,
    connection: Connection<Entity>,
): DeleteQueryBuilder<Entity> {
    const { repository, transaction } = connection;

    const queryBuilder = transaction
        ? transaction.manager.createQueryBuilder<Entity>(entity, tableAlias, transaction).delete()
        : repository.createQueryBuilder(tableAlias).delete();

    return queryBuilder;
}
