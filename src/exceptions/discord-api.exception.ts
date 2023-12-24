export class DiscordApiException extends Error {
    private readonly _name: string;
    private readonly _statusCode: number;
    private readonly _url: string;
    private _message: string;

    /**************************************************
     * Constructor
     **************************************************/
    constructor(statusCode: number, url: string, message: string) {
        super(message);

        this._name = 'DiscordApiException';
        this._statusCode = statusCode;
        this._url = url;
        this._message = message;

        Error.captureStackTrace(this, this.constructor);
    }

    /**************************************************
     * Public Methods
     **************************************************/
    get name() {
        return this._name;
    }

    get statusCode() {
        return this._statusCode;
    }

    get url() {
        return this._url;
    }

    get message() {
        return this._message;
    }

    set message(message: string) {
        this._message = message;
    }
}
