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
let query = '';

app.set('view engine', 'ejs');

app.get('/', (req, res) => res.render('index'));

app.post('/pay', (req, res) => {
    //SetExpresssCheckout values for recurring payment
    query = {
        'RETURNURL': "http://localhost:3000/success",
        'CANCELURL': "http://localhost:3000/cancel",
        'PAYMENTREQUEST_0_CURRENCYCODE': 'USD',
        'PAYMENTREQUEST_0_PAYMENTACTION': 'Authorization',
        'L_BILLINGTYPE0': 'RecurringPayments',
        'L_BILLINGAGREEMENTDESCRIPTION0': 'single membership',
        'PAYMENTREQUEST_0_AMT': '10000.00',
        'PAYMENTREQUEST_0_ITEMAMT': '10000.00',
        'PAYMENTREQUEST_0_DESC': 'single membership',
        'PAYMENTREQUEST_0_SHIPTONAME': 'Shipping Name',
        'PAYMENTREQUEST_0_SHIPTOSTREET': 'Shipping Street',
        'PAYMENTREQUEST_0_SHIPTOCITY': 'Shipping City',
        'PAYMENTREQUEST_n_SHIPTOSTATE': 'Shipping State',
        'PAYMENTREQUEST_n_SHIPTOCOUNTRYCODE': 'DE',
        'L_PAYMENTREQUEST_0_NAME0': 'Lab 1',
        'L_PAYMENTREQUEST_0_NUMBER0': '10101',
        'L_PAYMENTREQUEST_0_QTY0': '1',
        'L_PAYMENTREQUEST_0_AMT0': '10000.00',
        'L_PAYMENTREQUEST_0_DESC0': 'this is the desc.',
        'NOSHIPPING': '1'

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
    query = {
        'PAYMENTREQUEST_0_AMT': '10000.00',
        'PAYMENTREQUEST_0_CURRENCYCODE': 'USD',
        'PAYMENTREQUEST_0_PAYMENTACTION': 'Authorization',
        'TOKEN': token,
        'PAYERID': payerId
    };
    paypal.request('DoExpressCheckoutPayment', query).then((result) => {
        console.log('DoExpressCheckout called');
        console.log(result);
        var authorizationId = result.PAYMENTINFO_0_TRANSACTIONID;
        let query = {
            'AUTHORIZATIONID': authorizationId,
            'AMT': '20.00',
            'CURRENCYCODE': 'USD',
            "COMPLETETYPE": "Complete"
        };
        paypal.request('DoCapture', query).then((result) => {
            console.log('DoCapture called');
            console.log(result);
            //get the authorization id for capture
        }).catch((err) => {
            console.trace(err);
        });
        res.send('Done');

    }).catch((err) => {
        console.trace(err);
    });
});

app.get('/cancel', (req, res) => res.send('Cancelled'));

app.listen(3000, () => console.log('Server Started'));