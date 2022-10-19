export interface Przelewy24TransactionVerifyConfig {
    sessionId: string,
    amount: number,
    currency: string,
    orderId: number,
}

export interface Przelewy24TransactionVerifySuccess { }