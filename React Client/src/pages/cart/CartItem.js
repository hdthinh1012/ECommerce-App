import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useMediaQuery } from "react-responsive";

import "./CartPage.css"

const CartItem = ({ item }) => {
    const isDesktop = useMediaQuery({
        query: '(min-width: 1024px)'
    });

    const isTablet = useMediaQuery({
        query: '(min-width: 768px)'
    });

    const dispatch = useDispatch();
    const { _id, name, categoryId, price, imageUrl, quantity } = item;
    console.log("Categories", useSelector(state => state.menu.categories), categoryId);
    console.log(useSelector(state => state.menu.categories)[categoryId]);
    const category = useSelector(state => state.menu.categories)[categoryId];

    return (
        <React.Fragment>
            {(isDesktop) &&
                <div className="cart-item-div">
                    <div><img src={imageUrl} alt={imageUrl} className="cart-item-img" /></div>
                    <div>{name}</div>
                    <div>{category.name}</div>
                    <div>{price}</div>
                    <div>{quantity}</div>
                </div>}
            {(!isDesktop) &&
                <div className="cart-item-div">
                    <div className="cart-item-div-col-1"><img src={imageUrl} alt={imageUrl} className="cart-item-img" /></div>
                    <div className="cart-item-div-col-2">
                        <div>{name}</div>
                        <div>{category.name}</div>
                        <div>{price}</div>
                        <div>{quantity}</div>
                    </div>
                </div>
            }
        </React.Fragment>
    )
}

export default CartItem;