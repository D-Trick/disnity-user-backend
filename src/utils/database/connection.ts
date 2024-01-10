// types
import type { QueryRunner, Repository, ObjectLiteral, EntityManager } from 'typeorm';

/**************************************************/
interface Connection<T> {
    repository: Repository<T>;
    transaction?: QueryRunner;
}
/**************************************************/
/**
 * Connection
 * @param connection
 * @returns EntityManager | Repository<Entity>
 */
export function connection<Entity extends ObjectLiteral>(
    connection: Connection<Entity>,
): EntityManager | Repository<Entity> {
    const { repository, transaction } = connection;

    return transaction ? transaction.manager : repository;
}
