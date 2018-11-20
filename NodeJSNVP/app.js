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
    //set paymentaction to 'Sale' or 'Authorization' for authorization & capture
    //Plain SetExpresssCheckout

    let query = {
        'PAYMENTREQUEST_0_AMT': '20.00',
        'PAYMENTREQUEST_0_CURRENCYCODE': 'USD',
        'PAYMENTREQUEST_0_PAYMENTACTION': 'Sale',
        'RETURNURL': "http://localhost:3000/success",
        'CANCELURL': "http://localhost:3000/cancel"
    };

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