const Order = require("../databases/Order");
let axios = require('axios');
require("dotenv").config();

/**
 * Gaining authorization with Access Token to act on behalf of business PayPal Account
 *
 * Currently get Access Token for every PayPal API request => Performance issues, must implement refresh token mechanics  
 */
const getAccessToken = async (req, res) => {
    const url = 'https://api-m.sandbox.paypal.com/v1/oauth2/token';
    try {
        const params = new URLSearchParams();
        params.append('grant_type', 'client_credentials');
        const config = {
            auth: {
                username: "AUZcPEaGuyWYI45CPzAGPSMxJejKLPV7bx0rNz6EfIjhg1M07bdiCdUF7CepEa_Cs-MhRgnw8NqMxt28",
                password: "EIqwkfu4sNtzm6-umbZTSzV-8rR6zkY5utKkta28PPmxrswBya9Exl5Oyo-0tG9IvSXcFBQRQW7XAqlv",
            },
        }
        const apiResponseData = await axios.post(url, params, config);
        return apiResponseData.data["access_token"];
    } catch (err) {
        console.log(err);
        console.log("Error in access token");
    }
}

const createOrder = async (req, res) => {
    let { cartItems, accountInfo } = req.body;
    cartItems = Object.values(cartItems);
    let totalCost = (cartItems.map(item => item.price * item.quantity)).reduce((a, b) => a + b);
    cartItems = cartItems.map(item => {
        return {
            "sku": item._id,
            "name": item.name,
            "unit_amount": {
                currency_code: 'USD',
                value: item.price.toString(),
            },
            "quantity": item.quantity.toString(),
            /* "category": 1, */
        }
    });
    const url = 'https://api-m.sandbox.paypal.com/v2/checkout/orders';
    const accessToken = await getAccessToken();
    try {
        const data = {
            "intent": "CAPTURE",
            "payer": {
                "email_address": accountInfo.email,
                "name": {
                    "given_name": accountInfo.username,
                }
            },
            "purchase_units": [
                {
                    "amount": {
                        "currency_code": "USD",
                        "value": totalCost.toString(),
                        "breakdown": {
                            item_total: {
                                "currency_code": "USD",
                                "value": totalCost.toString(),
                            }
                        },
                    },
                    "payee": {
                        "email": "sb-pvery12060166@business.example.com",
                    },
                    "items": cartItems,
                }
            ]
        };
        const config = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            }
        };
        let createOrderResponse;
        try {
            createOrderResponse = await axios.post(url, data, config);
        } catch (err) {
            console.log("[OrderController.js] PayPal Create Order API Failed", err);
            res.status(409).send(JSON.stringify(err));
        }
        const userInfo = JSON.parse(req.sessionStore.sessions[req.sessionID])["userInfo"];

        const newOrder = new Order({
            _id: createOrderResponse.data.id,
            user_id: userInfo["_id"],
            status: createOrderResponse.data.status,
            total_amount: { currency_code: 'USD', value: totalCost.toString() },
            items: [],
            hateoas_links: [],
        });
        cartItems.forEach(cartItem => {
            newOrder.items.push({
                sku: cartItem.sku,
                name: cartItem.name,
                quantity: cartItem.quantity,
                unit_amount: { currency_code: 'USD', value: cartItem.unit_amount.value }
            });
        });
        createOrderResponse.data.links.forEach(link => {
            newOrder.hateoas_links.push({
                href: link.href,
                rel: link.rel,
                method: link.method,
            });
        });

        newOrder.save((err) => {
            if (err) {
                console.log("Save new Order err", err);
            }
        });
        res.status(200).send(JSON.stringify(createOrderResponse.data));
    }
    catch (err) {
        console.log("Error from createOrder PayPal API Call", err);
    }
}

const captureOrder = async (req, res) => {
    const { data } = req.body;
    // const { orderID, payerID, facilitatorAccessToken, paymentID, billingToken } = data;

    const capturedOrder = await Order.find({ _id: data.orderID });
    const { hateoas_links } = capturedOrder[0];
    const approveOrderPaymentLink = hateoas_links.filter(link => link.rel === 'approve')[0];
    const captureOrderPaymentLink = hateoas_links.filter(link => link.rel === "capture")[0];

    const approve_response = await axios.get(approveOrderPaymentLink.href, {}, {});
    if (approve_response.status === 200) {
        const accessToken = await getAccessToken();
        const captureOrderResponse = await axios.post(captureOrderPaymentLink.href, {}, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            }
        });
        /**
         * purchase_units.payments.captures show list of captures of the purchase_units
         */
        // const { id, status, purchase_units, payer, links } = captureOrderResponse.data;

        const capturedOrder = await Order.findOne({ _id: captureOrderResponse.data.id })
        capturedOrder.status = captureOrderResponse.data.status;
        capturedOrder.save((err) => {
            if (err) {
                console.log("Save captured Order err", err);
            }
        });
        res.status(200).send(JSON.stringify(captureOrderResponse.data));
    }
}

module.exports = {
    createOrder, captureOrder, getAccessToken
};