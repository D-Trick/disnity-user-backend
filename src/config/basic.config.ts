// configs
import { ENV_CONFIG } from './env.config';

// ----------------------------------------------------------------------
interface Config {
    DOMAIN: string;
    URL: string;
}
// ----------------------------------------------------------------------

export const BASE_CONFIG: Config = {
    DOMAIN: ENV_CONFIG.DOMAIN,
    URL: ENV_CONFIG.IS_DEV_MODE ? `http://${ENV_CONFIG.DOMAIN}` : `https://${ENV_CONFIG.DOMAIN}`,
} as const;
