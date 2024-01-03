// types
import type { QueryRunner, Repository, EntityManager, ObjectLiteral } from 'typeorm';

/**************************************************/
interface Connection<T> {
    repository: Repository<T>;
    transaction?: QueryRunner;
}
/**************************************************/

/**
 * createEntityManager
 * @param connection
 * @return EntityManager
 */
export function createEntityManager<Entity extends ObjectLiteral>(connection: Connection<Entity>): EntityManager {
    const { repository, transaction } = connection;

    const entityManager = transaction ? transaction.manager : repository.manager;

    return entityManager;
}
