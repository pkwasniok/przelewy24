export interface Przelewy24ClientConfig {
    sandbox: boolean;
    merchantId: number;
    posId: number;
    apiKey: string;
    crc: string;
    urlReturn: string;
    urlStatus: string;
    timeLimit?: number;
    channel?: number;
    waitForResult?: boolean;
}
