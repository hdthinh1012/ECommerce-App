import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from "axios";
import "./CartPage.css";

const CartHeader = ({ header }) => {
    return (
        <div className='cart-header'>
            {header.map(field => {
                return (
                    <div key={field}>{field}</div>
                )
            })}
        </div>
    )
}

export default CartHeader;