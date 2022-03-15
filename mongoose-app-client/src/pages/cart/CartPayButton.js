import React, { useEffect, useState } from 'react';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import axios from 'axios';
import "./CartPage.css"

const CartPayButton = ({ cartItems, accountInfo }) => {
    return (
        <div className="pay-button">
            <PayPalScriptProvider options={{ "client-id": "AUZcPEaGuyWYI45CPzAGPSMxJejKLPV7bx0rNz6EfIjhg1M07bdiCdUF7CepEa_Cs-MhRgnw8NqMxt28" }}>
                <PayPalButtons
                    createOrder={async (data, action) => {
                        const response = await axios.post("http://localhost:4000/order/create-order", {
                            cartItems, accountInfo
                        }, {
                            withCredentials: true,
                        });
                        console.log("PayPal button response", response.data);
                        return response.data.id;
                    }
                    }
                    onApprove={async (data, actions) => {
                        // console.log("CartPayButton onAppove() data and actions", data, actions);
                        const response = await axios.post("http://localhost:4000/order/capture-order", { data }, {
                            withCredentials: true,
                        });
                        const what = actions.order.capture().then((details) => {
                            console.log(details);
                        });
                        console.log("what", what);
                    }}
                />
            </PayPalScriptProvider>
        </div>
    );
}

export default CartPayButton;