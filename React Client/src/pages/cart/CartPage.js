import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import axios from 'axios';

import "./CartPage.css"
import CartItem from './CartItem';
import CartHeader from './CartHeader';
import CartPayButton from './CartPayButton';


const CartPage = (props) => {

    const accountInfo = useSelector(state => state.account);
    const isAccountLoggedIn = accountInfo['status'] === 'member';

    const { items: cartItems } = useSelector(state => state.cart);
    if (Object.keys(cartItems).length === 0) {
        return (
            <div>
                <div className="login-page-title"><div>Your Cart</div></div>
                <div>Empty Cart</div>
            </div>
        );
    }
    else {
        let header = Object.keys(Object.values(cartItems)[0]);
        // header = header.filter(value => !["__v", "_id"].includes(value));
        header = ["ImageUrl", "Name", "Category", "Price", "Quantity"];
        return (
            <div>
                <div className="login-page-title"><div>Your Cart</div></div>
                <div className="page-cart-wrapper">
                    <div className="cart-wrapper">
                        <CartHeader header={header} />
                        {Object.values(cartItems).map(item => {
                            return <CartItem item={item} key={item._id} />;
                        })}
                    </div>
                </div>
                {isAccountLoggedIn
                    ? <CartPayButton cartItems={cartItems} accountInfo={accountInfo} />
                    : <div className='pay-button'><div>Please Login Before Proceed Payment</div></div>
                }
            </div>
        );
    }
}

export default CartPage;