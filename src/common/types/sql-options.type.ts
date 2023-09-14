// types
import type { QueryRunner } from 'typeorm/query-runner/QueryRunner';

// ----------------------------------------------------------------------

export interface SqlOptions {
    transaction?: QueryRunner;
    limit?: number;
    offset?: number;
}
