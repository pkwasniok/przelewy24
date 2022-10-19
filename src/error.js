export class Przelewy24Error extends Error {
    constructor(message, endpoint) {
        super(message);
        this.endpoint = endpoint;
    }
}
export class Przelewy24AuthenticationError extends Przelewy24Error {
    constructor(endpoint) {
        super('Authentication error occured while trying to access api', endpoint);
    }
}
export class Przelewy24UnknownError extends Przelewy24Error {
    constructor(endpoint, metadata) {
        super('Unknown error occured while trying to access api', endpoint);
        this.metadata = metadata;
    }
}
