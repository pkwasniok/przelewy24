import { Buffer } from 'buffer';
import fetch from 'node-fetch';
import crypto from 'crypto';
import { Przelewy24ClientConfig } from './client.interface.js';
import { Przelewy24PaymentMethod, Przelewy24PaymentMethodsApiResponse } from './payment-method.interface.js';
import { Przelewy24TransactionRegisterApiResponse, Przelewy24TransactionRegisterConfig, Przelewy24TransactionRegisterSuccess } from './transaction-register.interface.js';
import { Przelewy24TransactionVerifyConfig, Przelewy24TransactionVerifySuccess } from './transaction-verify.interface.js';
import { Przelewy24AuthenticationError, Przelewy24UnknownError } from './error.js';



const API_SANDBOX = 'https://sandbox.przelewy24.pl/api/v1';
const API_PRODUCTION = 'https://secure.przelewy24.pl/api/v1';



export class Przelewy24Client {
    config: Przelewy24ClientConfig;
    apiUrl: string;
    credentials: string;

    constructor (config: Przelewy24ClientConfig) {
        this.config = config;
    
        // Set api url based on environment selected in config
        if (this.config.sandbox) {
            this.apiUrl = API_SANDBOX;
        }
        else {
            this.apiUrl = API_PRODUCTION;
        }

        // Generate http basic auth credentials string from pos id and api key (used for authentication in rest api)
        this.credentials = Buffer.from(`${this.config.posId}:${this.config.apiKey}`).toString('base64');
    }



    // Test api access
    async testAccess(): Promise<boolean> {
        const response = await fetch(this.apiUrl + '/testAccess', {
            method: 'get',
            headers: {
                'Authorization': `Basic ${this.credentials}`,
            }
        });           

        return response.status == 200;
    }



    // Get available payment methods
    async paymentMethods(language: string): Promise<Przelewy24PaymentMethod[]> {
        const response = await fetch(this.apiUrl + `/payment/methods/${language}`, {
            method: 'get',
            headers: {
                'Authorization': `Basic ${this.credentials}`,
            }
        });

        if (response.status == 401) {
            throw new Przelewy24AuthenticationError('/payment/methods');
        }
        else if (response.status != 200) {
            throw new Przelewy24UnknownError('/payment/methods', {
                status: response.status,
                statusText: response.statusText,
                body: await response.json(),
            });
        }

        try {
            const body = await response.json() as Przelewy24PaymentMethodsApiResponse;

            const paymentMethods: Przelewy24PaymentMethod[] = body.data.map((item) => (item as Przelewy24PaymentMethod));

            return paymentMethods;
        }
        catch (e) {
            return [];
        }
    }



    // Register new transaction in Przelewy24
    async transactionRegister(config: Przelewy24TransactionRegisterConfig): Promise<Przelewy24TransactionRegisterSuccess> {
        // Generate checksum to sign body
        const checksum = crypto.createHash('sha384').update(`{"sessionId":"${config.sessionId}","merchantId":${this.config.merchantId},"amount":${config.amount},"currency":"${config.currency}","crc":"${this.config.crc}"}`).digest('hex')

        const response = await fetch(this.apiUrl + '/transaction/register', {
            method: 'post',
            headers: {
                'Authorization': `Basic ${this.credentials}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                merchantId: this.config.merchantId,
                posId: this.config.posId,
                sessionId: config.sessionId,
                amount: config.amount,
                currency: config.currency,
                description: config.description,
                email: config.email,
                country: config.country,
                language: config.language,
                urlReturn: this.config.urlReturn,
                urlStatus: this.config.urlStatus,
                sign: checksum,
                method: config.method,
            }),
        });

        if (response.status == 401) {
            throw new Przelewy24AuthenticationError('/transaction/register');
        }
        else if(response.status != 200) {
            throw new Przelewy24UnknownError('/transaction/register', {
                status: response.status,
                statusText: response.statusText,
                body: await response.json(),
            });
        }

        const body = (await response.json()) as Przelewy24TransactionRegisterApiResponse;

        return {
            token: body.data.token,
        };
    }



    // Verify registered transaction
    async transactionVerify(config: Przelewy24TransactionVerifyConfig): Promise<Przelewy24TransactionVerifySuccess> {
        // Generate checksum to sign request body
        const checksum = crypto.createHash('sha384').update(`{"sessionId":"${config.sessionId}","orderId":${config.orderId},"amount":${config.amount},"currency":"${config.currency}","crc":"${this.config.crc}"}`).digest('hex');

        const response = await fetch(this.apiUrl + '/transaction/verify', {
            method: 'put',
            headers: {
                'Authorization': `Basic ${this.credentials}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                merchantId: this.config.merchantId,
                posId: this.config.posId,
                sign: checksum,
                sessionId: config.sessionId,
                amount: config.amount,
                currency: config.currency,
                orderId: config.orderId,
            }),
        });

        if (response.status == 401) {
            throw new Przelewy24AuthenticationError('/transaction/verify');
        }
        else if (response.status != 200) {
            throw new Przelewy24UnknownError('/transaction/verify', {
                status: response.status,
                statusText: response.statusText,
                body: await response.json(),
            });
        }

        return { }
    }
}