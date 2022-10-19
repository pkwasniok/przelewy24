export class Przelewy24Error extends Error {
    endpoint: string;

    constructor(message: string, endpoint: string) {
        super(message);
        this.endpoint = endpoint;
    }
}

export class Przelewy24AuthenticationError extends Przelewy24Error {
    constructor(endpoint: string) {
        super('Authentication error occured while trying to access api', endpoint);
    }
}

export class Przelewy24UnknownError extends Przelewy24Error {
    metadata?: object;

    constructor(endpoint: string, metadata?: object) {
        super('Unknown error occured while trying to access api', endpoint);
        this.metadata = metadata;
    }
}