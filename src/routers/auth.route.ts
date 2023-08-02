// modules
import { AuthModule } from '@models/auth/auth.module';

// ----------------------------------------------------------------------

const authRouter = {
    path: 'auth',
    module: AuthModule,
};

export default authRouter;
