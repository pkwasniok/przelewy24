export declare class Przelewy24Error extends Error {
    endpoint: string;
    constructor(message: string, endpoint: string);
}
export declare class Przelewy24AuthenticationError extends Przelewy24Error {
    constructor(endpoint: string);
}
export declare class Przelewy24UnknownError extends Przelewy24Error {
    metadata?: object;
    constructor(endpoint: string, metadata?: object);
}
