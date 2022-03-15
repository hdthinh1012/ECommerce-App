import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchLogoutAccount } from './account/accountSlice';

const ServerPort = process.env.REACT_APP_SERVER_PORT;
const ServerURL = process.env.REACT_APP_SERVER_URL;
const ServerURI = `${ServerURL}:${ServerPort}`;

const logout = async (navigate, dispatch, setCookie) => {
    await dispatch(fetchLogoutAccount());
    setCookie("uniqueSessionID", null, { path: '/' });
    setCookie("accountInfo", null, { path: '/' });
    navigate("/login");
}

const HomePage = (props) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [cookies, setCookie] = useCookies(["uniqueSessionID", "accountInfo"]);

    return (
        <div>
            {/* greeting here is send directly from server after checking is the uniqueSessionID is valid, nothing magical here */}
            <button onClick={() => { logout(navigate, dispatch, setCookie) }}>Logout</button>
        </div>
    )
}

export default HomePage;