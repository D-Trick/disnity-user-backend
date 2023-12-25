// configs
import { ENV_CONFIG } from './env.config';

// ----------------------------------------------------------------------
interface config {
    url: string;
}
// ----------------------------------------------------------------------

export const DOMAIN = ENV_CONFIG.DOMAIN;
export const baseConfig: config = {
    url: ENV_CONFIG.IS_DEV_MODE ? `http://${DOMAIN}` : `https://${DOMAIN}`,
};
