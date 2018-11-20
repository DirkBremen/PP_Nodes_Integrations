var express = require('express');
var request = require('request');
// Add your credentials:
// Add your client ID and secret
var CLIENT =
    'AUwffmEqTvZfFZzpxSyD0Lr7GCLxyTxppff6tGv9m2WdNh8VK3o1YZ4HwkTA54iPzOqIO0Cpy1GtdiwS';
var SECRET =
    'EPE1Wv6KetPfsx8McWMIOjwXHE2OiOVnJ-ED9e4FacpGI-pJjbzmaVOYj9Xc5jeQ3WnYoTwEFwWnr4x9';
var PAYPAL_API = 'https://api.sandbox.paypal.com';
express()
    .set('view engine', 'ejs')
    .get('/', (req, res) => res.render('index'))
    // Set up the payment:
    // 1. Set up a URL to handle requests from the PayPal button
    .post('/create-payment', function (req, res) {
        // 2. Call /v1/payments/payment to set up the payment
        request.post(PAYPAL_API + '/v1/payments/payment',
            {
                auth:
                {
                    user: CLIENT,
                    pass: SECRET
                },
                body:
                {
                    intent: 'sale',
                    payer:
                    {
                        payment_method: 'paypal'
                    },
                    transactions: [
                        {
                            amount:
                            {
                                total: '5.99',
                                currency: 'USD'
                            }
                        }],
                    redirect_urls:
                    {
                        return_url: 'https://www.mysite.com',
                        cancel_url: 'https://www.mysite.com'
                    }
                },
                json: true
            }, function (err, response) {
                if (err) {
                    console.error(err);
                    return res.sendStatus(500);
                }
                // 3. Return the payment ID to the client
                res.json(
                    {
                        id: response.body.id
                    });
            });
    })
    // Execute the payment:
    // 1. Set up a URL to handle requests from the PayPal button.
    .post('/execute-payment', function (req, res) {
        // 2. Get the payment ID and the payer ID from the request body.
        const payerId = req.query.PayerID;
        const paymentId = req.query.paymentId;

        // 3. Call /v1/payments/payment/PAY-XXX/execute to finalize the payment.
        request.post(PAYPAL_API + '/v1/payments/payment/' + paymentId +
            '/execute',
            {
                auth:
                {
                    user: CLIENT,
                    pass: SECRET
                },
                body:
                {
                    payer_id: payerId,
                    transactions: [
                        {
                            amount:
                            {
                                total: '10.99',
                                currency: 'USD'
                            }
                        }]
                },
                json: true
            },
            function (err, response) {
                if (err) {
                    console.error(err);
                    return res.sendStatus(500);
                }
                // 4. Return a success response to the client
                console.log(JSON.stringify(response));
                res.json(
                    {
                        status: 'success'
                    });
            });
    }).listen(3000, function () {
        console.log('Server listening at http://localhost:3000/');
    });
// Run `node ./server.js` in your terminal