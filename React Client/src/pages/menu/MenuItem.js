import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import "./MenuPage.css";
import { BsCartPlus } from "react-icons/bs";
import { IconContext } from "react-icons";
import { itemAdded, addItemToCart } from '../cart/cartSlice';

const MenuItem = ({ item }) => {
    const dispatch = useDispatch();

    return (
        <div key={item._id} className="item-card">
            <div className='item-card-col-1'>
                <div className='item-card-col-1-row-1'>
                    <div className="item-category">{item.categoryName}</div>
                    <div className="item-name">{item.name}</div>
                </div>
                <div className='item-card-col-1-row-2'>
                    <div className="item-price">{item.price} $</div>
                </div>
            </div>
            <div className='item-card-col-2'
                style={{
                    backgroundImage: `url(${item.imageUrl})`,
                }}
            >
                <div className='add-to-cart-btn' onClick={() => dispatch(addItemToCart(item._id))}>
                    <IconContext.Provider value={{ className: "add-to-cart-icon" }}>
                        <BsCartPlus />
                    </IconContext.Provider>
                </div>
            </div>
        </div>
    )
}

export default MenuItem;