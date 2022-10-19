import { Przelewy24ClientConfig } from './client.interface.js';
import { Przelewy24PaymentMethod } from './payment-method.interface.js';
import { Przelewy24TransactionRegisterConfig, Przelewy24TransactionRegisterSuccess } from './transaction-register.interface.js';
import { Przelewy24TransactionVerifyConfig, Przelewy24TransactionVerifySuccess } from './transaction-verify.interface.js';
export declare class Przelewy24Client {
    config: Przelewy24ClientConfig;
    apiUrl: string;
    credentials: string;
    constructor(config: Przelewy24ClientConfig);
    testAccess(): Promise<boolean>;
    paymentMethods(language: string): Promise<Przelewy24PaymentMethod[]>;
    transactionRegister(config: Przelewy24TransactionRegisterConfig): Promise<Przelewy24TransactionRegisterSuccess>;
    transactionVerify(config: Przelewy24TransactionVerifyConfig): Promise<Przelewy24TransactionVerifySuccess>;
}
