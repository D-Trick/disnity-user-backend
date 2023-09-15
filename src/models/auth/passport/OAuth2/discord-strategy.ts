// lib
import { Strategy as OAuth2Strategy, StrategyOptions, VerifyFunction } from 'passport-oauth2';
import { filterAdminGuilds } from '@utils/discord/permission';
// configs
import { discordConfig } from '@config/discord.config';

// ----------------------------------------------------------------------

const { API_URL } = discordConfig;

/**
 * `Strategy` constructor.
 *
 * The Discord authentication strategy authenticates requests by delegating to
 * Discord via the OAuth2.0 protocol
 *
 * Applications must supply a `verify` callback which accepts an `accessToken`,
 * `refreshToken` and service-specific `profile`, and then calls the `cb`
 * callback supplying a `user`, which should be set to `false` if the
 * credentials are not valid. If an exception occured, `err` should be set.
 *
 * Options:
 *   - `clientID`       OAuth ID to discord
 *   - `clientSecret`   OAuth Secret to verify client to discord
 *   - `callbackURL`    URL that discord will redirect to after auth
 *   - `scope`          Array of permission scopes to request
 *                      Check the official documentation for valid scopes to pass as an array.
 *
 * @constructor
 * @param {object} options
 * @param {function} verify
 * @access public
 */

export class Strategy extends OAuth2Strategy {
    public name = 'discord';

    constructor(options: StrategyOptions, verify: VerifyFunction) {
        super(options, verify);

        this._oauth2.useAuthorizationHeaderforGET(true);
    }

    /**
     * Retrieve user profile from Discord.
     *
     * This function constructs a normalized profile.
     * Along with the properties returned from /users/@me, properties returned include:
     *   - `connections`      Connections data if you requested this scope
     *   - `guilds`           Guilds data if you requested this scope
     *   - `fetchedAt`        When the data was fetched as a `Date`
     *   - `accessToken`      The access token used to fetch the (may be useful for refresh)
     *
     * @param {string} accessToken
     * @param {function} done
     * @access protected
     */
    async userProfile(accessToken: string, done: (err?: Error | null, profile?: any) => void): Promise<void> {
        try {
            const promise1 = this.oAuth2Get(`${API_URL}/users/@me`, accessToken);
            const promise2 = this.oAuth2Get(`${API_URL}/users/@me/guilds`, accessToken);

            const [user, guilds] = await Promise.all([promise1, promise2]);

            const profile = {
                ...user,
                guilds,
                admin_guilds: filterAdminGuilds(guilds),
            };

            return done(null, profile);
        } catch {
            return done(null, { loginRedirect: true });
        }
    }

    /**
     * Return extra parameters to be included in the authorization request.
     *
     * @param {Object} options
     * @return {Object}
     * @api protected
     */
    authorizationParams(options: any) {
        const params: any = {};

        if (typeof options.permissions !== 'undefined') {
            params.permissions = options.permissions;
        }

        return params;
    }

    /**
     *
     * @param {string} url
     * @param {string} accessToken
     */
    async oAuth2Get(url: string, accessToken: string): Promise<any> {
        return new Promise((resolve, reject) => {
            // function (error: { statusCode: number; data?: any }, result?: any, response?: IncomingMessage) {
            this._oauth2.get(url, accessToken, function (error: { statusCode: number; data?: any }, result?: any) {
                if (error) {
                    reject({
                        error,
                        customMessage: '요청을 실패했습니다.',
                    });
                }

                try {
                    const data = JSON.parse(result);

                    resolve(data);
                } catch {
                    reject({
                        customMessage: '요청 데이터 처리를 실패했습니다.',
                    });
                }
            });
        });
    }
}
