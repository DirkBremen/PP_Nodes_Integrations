const express = require('express');
const ejs = require('ejs');
var Paypal = require('paypal-nvp-api');

let config = {
    mode: 'sandbox', // or 'live'
    username: 'merchant74_api1.gmail.com',
    password: 'NGA3X5HFQCTVHETS',
    signature: 'A0D2TVkf7Pjk-x7ZaBcqTEtb2NMNACvcwk4XeC-MH8ysEw9UGWgo7hmy'
}

let paypal = Paypal(config);

const app = express();
var token = '';

app.set('view engine', 'ejs');

app.get('/', (req, res) => res.render('index'));

app.post('/pay', (req, res) => {
    //SetExpresssCheckout values parallel payment
    let query = {
        'RETURNURL': "http://localhost:3000/success",
        'CANCELURL': "http://localhost:3000/cancel",
        'PAYMENTREQUEST_0_CURRENCYCODE': 'USD',
        'PAYMENTREQUEST_0_AMT': '300',
        'PAYMENTREQUEST_0_ITEMAMT': '200',
        'PAYMENTREQUEST_0_TAXAMT': '100',
        'PAYMENTREQUEST_0_DESC': 'Summer Vacation trip',
        'PAYMENTREQUEST_0_INSURANCEAMT': '0',
        'PAYMENTREQUEST_0_SHIPDISCAMT': '0',
        'PAYMENTREQUEST_0_SELLERPAYPALACCOUNTID': 'merchant74@gmail.com',
        'PAYMENTREQUEST_0_INSURANCEOPTIONOFFERED': 'false',
        'PAYMENTREQUEST_0_PAYMENTACTION': 'Sale',
        'PAYMENTREQUEST_0_PAYMENTREQUESTID': 'CART26488-PAYMENT0',
        'PAYMENTREQUEST_1_CURRENCYCODE': 'USD',
        'PAYMENTREQUEST_1_AMT': '200',
        'PAYMENTREQUEST_1_ITEMAMT': '180',
        'PAYMENTREQUEST_1_SHIPPINGAMT': '0',
        'PAYMENTREQUEST_1_HANDLINGAMT': '0',
        'PAYMENTREQUEST_1_TAXAMT': '20',
        'PAYMENTREQUEST_1_DESC': 'Summer Vacation trip',
        'PAYMENTREQUEST_1_INSURANCEAMT': '0',
        'PAYMENTREQUEST_1_SHIPDISCAMT': '0',
        'PAYMENTREQUEST_1_SELLERPAYPALACCOUNTID': 'dirkpp74-facilitator@gmail.com',
        'PAYMENTREQUEST_1_INSURANCEOPTIONOFFERED': 'false',
        'PAYMENTREQUEST_1_PAYMENTACTION': 'Sale',
        'PAYMENTREQUEST_1_PAYMENTREQUESTID': 'CART26488-PAYMENT1',
        'L_PAYMENTREQUEST_0_NAME0': 'Depart San Jose Feb 12 at 12:10PM Arrive in Baltimore at 10:22PM',
        'L_PAYMENTREQUEST_0_NAME1': 'Depart Baltimore Feb 15 at 6:13 PM Arrive in San Jose at 10:51 PM',
        'L_PAYMENTREQUEST_0_NUMBER0': 'Flight 522',
        'L_PAYMENTREQUEST_0_NUMBER1': 'Flight 961',
        'L_PAYMENTREQUEST_0_QTY0': '1',
        'L_PAYMENTREQUEST_0_QTY1': '1',
        'L_PAYMENTREQUEST_0_TAXAMT0': '50',
        'L_PAYMENTREQUEST_0_TAXAMT1': '50',
        'L_PAYMENTREQUEST_0_AMT0': '50',
        'L_PAYMENTREQUEST_0_AMT1': '150',
        'L_PAYMENTREQUEST_0_DESC0': 'SJC Terminal 1. Flight time: 7 hours 12 minutes',
        'L_PAYMENTREQUEST_0_DESC1': 'BWI Terminal 1. Flight time: 7 hours 38 minutes',
        'L_PAYMENTREQUEST_1_NAME0': 'Night(s) stay at 9990 Deereco Road, Timonium, MD 21093',
        'L_PAYMENTREQUEST_1_NUMBER0': '300',
        'L_PAYMENTREQUEST_1_QTY0': '1',
        'L_PAYMENTREQUEST_1_TAXAMT0': '20',
        'L_PAYMENTREQUEST_1_AMT0': '180',
        'L_PAYMENTREQUEST_1_DESC0': 'King No-Smoking; Check in after 4:00 PM; Check out by 1:00 PM'
    }
    paypal.request('SetExpressCheckout', query).then((result) => {
        console.log('SetExpressCheckout called');
        console.log(result);
        token = result.TOKEN;
        var url = "https://www.sandbox.paypal.com/checkoutnow?token=" + token;
        res.redirect(url);
    }).catch((err) => {
        console.trace(err);
    });

});

app.get('/success', (req, res) => {
    const payerId = req.query.PayerID;
    //set paymentaction to 'Sale' or 'Authorization' for authorization , capture
    //for DoExpressCheckout works also for Reference Transaction
    let query = {
        'PAYMENTREQUEST_0_AMT': '20.00',
        'PAYMENTREQUEST_0_CURRENCYCODE': 'USD',
        'PAYMENTREQUEST_0_PAYMENTACTION': 'Sale',
        'TOKEN': token,
        'PAYERID': payerId
    };
    paypal.request('DoExpressCheckoutPayment', query).then((result) => {
        console.log('DoExpressCheckout called');
        console.log(result);
        res.send('Done');

    }).catch((err) => {
        console.trace(err);
    });
});

app.get('/cancel', (req, res) => res.send('Cancelled'));

app.listen(3000, () => console.log('Server Started'));