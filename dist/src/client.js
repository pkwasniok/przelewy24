var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Buffer } from 'buffer';
import fetch from 'node-fetch';
import crypto from 'crypto';
import { Przelewy24AuthenticationError, Przelewy24UnknownError } from './error.js';
const API_SANDBOX = 'https://sandbox.przelewy24.pl/api/v1';
const API_PRODUCTION = 'https://secure.przelewy24.pl/api/v1';
export class Przelewy24Client {
    constructor(config) {
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
    testAccess() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch(this.apiUrl + '/testAccess', {
                method: 'get',
                headers: {
                    'Authorization': `Basic ${this.credentials}`,
                }
            });
            return response.status == 200;
        });
    }
    // Get available payment methods
    paymentMethods(language) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch(this.apiUrl + `/payment/methods/${language}`, {
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
                    body: yield response.json(),
                });
            }
            try {
                const body = yield response.json();
                const paymentMethods = body.data.map((item) => item);
                return paymentMethods;
            }
            catch (e) {
                return [];
            }
        });
    }
    // Register new transaction in Przelewy24
    transactionRegister(config) {
        return __awaiter(this, void 0, void 0, function* () {
            // Generate checksum to sign body
            const checksum = crypto.createHash('sha384').update(`{"sessionId":"${config.sessionId}","merchantId":${this.config.merchantId},"amount":${config.amount},"currency":"${config.currency}","crc":"${this.config.crc}"}`).digest('hex');
            const response = yield fetch(this.apiUrl + '/transaction/register', {
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
            else if (response.status != 200) {
                throw new Przelewy24UnknownError('/transaction/register', {
                    status: response.status,
                    statusText: response.statusText,
                    body: yield response.json(),
                });
            }
            const body = (yield response.json());
            return {
                token: body.data.token,
            };
        });
    }
    // Verify registered transaction
    transactionVerify(config) {
        return __awaiter(this, void 0, void 0, function* () {
            // Generate checksum to sign request body
            const checksum = crypto.createHash('sha384').update(`{"sessionId":"${config.sessionId}","orderId":${config.orderId},"amount":${config.amount},"currency":"${config.currency}","crc":"${this.config.crc}"}`).digest('hex');
            const response = yield fetch(this.apiUrl + '/transaction/verify', {
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
                    body: yield response.json(),
                });
            }
            return {};
        });
    }
}
