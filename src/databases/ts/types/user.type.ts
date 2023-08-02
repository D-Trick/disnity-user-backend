// entities
import { User } from '@databases/entities/user.entity';

// ----------------------------------------------------------------------

/******************************
 * Select
 ******************************/
export type Select = Pick<
    User,
    | 'id'
    | 'global_name'
    | 'username'
    | 'discriminator'
    | 'email'
    | 'verified'
    | 'avatar'
    | 'locale'
    | 'created_at'
    | 'updated_at'
>;
