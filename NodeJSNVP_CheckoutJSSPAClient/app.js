const express = require('express');
const ejs = require('ejs');
var Paypal = require('paypal-nvp-api');
var bodyParser = require("body-parser");
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
app.use("/lib", express.static(__dirname + "/lib"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.get('/', (req, res) => res.render('index'));

app.post('/setexpresscheckout', (req, res) => {
    //set paymentaction to 'Sale' or 'Authorization' for authorization & capture
    //Plain SetExpresssCheckout

    let query = {
        'PAYMENTREQUEST_0_AMT': '20.00',
        'PAYMENTREQUEST_0_CURRENCYCODE': 'USD',
        'PAYMENTREQUEST_0_PAYMENTACTION': 'Sale',
        'RETURNURL': "http://localhost:3000",
        'CANCELURL': "http://localhost:3000"
    };

    paypal.request('SetExpressCheckout', query).then((result) => {
        console.log('SetExpressCheckout called');
        console.log(result);
        token = result.TOKEN;
        res.send(result);
    }).catch((err) => {
        console.trace(err);
    });

});
app.get('/getexpresscheckout', (req, res) => {
    //set paymentaction to 'Sale' or 'Authorization' for authorization & capture
    //Plain SetExpresssCheckout

    let query = {
        'TOKEN': token
    };

    paypal.request('GetExpressCheckoutDetails', query).then((result) => {
        console.log('GetExpressCheckout called');
        console.log(result);
        res.send(result);
    }).catch((err) => {
        console.trace(err);
    });

});


app.post('/doexpresscheckcout', (req, res) => {
    console.log(req.body);
    const payerId = req.body.PAYERID;
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

app.listen(3000, () => console.log('Server Started'));