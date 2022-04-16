import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import "./MenuPage.css";

import MenuItem from './MenuItem';

const ServerURI = process.env.REACT_APP_SERVER_URL;

const MenuPage = (props) => {
    // const [menu, setMenu] = useState([]);

    const loadingStatus = useSelector(state => state.menu.status);
    const menu = useSelector(state => state.menu.items);

    if (loadingStatus === 'loading') {
        return (
            <div>
                <div className="page-title"><h1>Menu</h1></div>
                <div className="item-card-wrapper">
                    <div className="load-spinner" />
                </div>
            </div>
        )
    }
    return (
        <div>
            <div className="page-title"><h1>Menu</h1></div>
            <button onClick={async () => {
                const response = await axios.get(`${ServerURI}/funiture/all`, {
                    withCredentials: true
                });
            }}>Click</button>
            <div className="item-card-wrapper">
                {Object.values(menu).map((item, index) => {
                    return <MenuItem item={item} key={item._id} />
                })}
            </div>
        </div>
    )
}

export default MenuPage;