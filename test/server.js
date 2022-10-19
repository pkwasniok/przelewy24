var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import express from 'express';
import crypto from 'crypto';
import { Przelewy24Client } from '../index.js';
// console.log(crypto.createHash('sha384').update(`{"merchantId":94302,"posId":94302,"sessionId":"asdasd","amount":100,"originAmount":100,"currency":"PLN","orderId":0,"methodId":181,"statement":"asdasd","crc":"e4cef8b5c7277dcb"}`).digest('base64'));
const app = express();
app.use(express.json());
const client = new Przelewy24Client({
    sandbox: true,
    merchantId: 94302,
    posId: 94302,
    apiKey: 'db86db25ca8cee86476046a2a87ca914',
    crc: 'e4cef8b5c7277dcb',
    urlReturn: 'https://matascha.com/',
    urlStatus: 'https://d246-91-233-251-92.eu.ngrok.io/',
});
app.get('/', (req, res) => {
    res.send('Server is working').end();
});
app.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Generate checksum and compare with request body sign
    const checksum = crypto.createHash('sha384').update(`{"merchantId":${req.body.merchantId},"posId":${req.body.posId},"sessionId":"${req.body.sessionId}","amount":${req.body.amount},"originAmount":${req.body.originAmount},"currency":"${req.body.currency}","orderId":${req.body.orderId},"methodId":${req.body.methodId},"statement":"${req.body.statement}","crc":"e4cef8b5c7277dcb"}`).digest('hex');
    // Check if request sign matches with calculated checksum
    if (checksum != req.body.sign) {
        res.end();
        return 0;
    }
    // Verify transaction
    const response = yield client.transactionVerify({
        amount: req.body.amount,
        currency: req.body.currency,
        orderId: req.body.orderId,
        sessionId: req.body.sessionId,
    });
    console.log(`Successfully verified payment ${req.body.sessionId}`);
    res.end();
}));
app.get('/register', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const transaction = yield client.transactionRegister({
        sessionId: `#${req.query.id}`,
        description: 'Order #ASFAGNRJGA',
        amount: 100,
        country: 'pl',
        currency: 'PLN',
        email: 'kwasniokpatryk@gmail.com',
        language: 'pl',
    });
    res.send(`Registered new transaction with token ${transaction.token}\n Go to <a href="https://sandbox.przelewy24.pl/trnRequest/${transaction.token}">payment</a>`);
}));
app.listen(3000, () => {
    console.log('Started server on port 3000.');
});
