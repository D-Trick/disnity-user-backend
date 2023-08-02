// routes
import apiRouter from '@routers/api.route';
import authRouter from '@routers/auth.route';
import redirect from '@routers/redirect.route';

// ----------------------------------------------------------------------
const router = [apiRouter, authRouter, redirect];
// ----------------------------------------------------------------------

export default router;
